import sys
import json
import pandas as pd
import numpy as np

# -----------------------------------------------------
# Helper: Get Ratios
# -----------------------------------------------------
def get_ratios(use_case):
    ratios = {
        'Gaming': {'gpu': 0.45, 'cpu': 0.20, 'ram': 0.10, 'motherboard': 0.10, 'psu': 0.05, 'storage': 0.05, 'case': 0.05},
        'Productivity': {'cpu': 0.40, 'gpu': 0.20, 'ram': 0.15, 'storage': 0.10, 'motherboard': 0.10, 'psu': 0.05, 'case': 0.05},
        'General': {'cpu': 0.30, 'gpu': 0.10, 'ram': 0.20, 'storage': 0.15, 'motherboard': 0.10, 'psu': 0.10, 'case': 0.05}
    }
    return ratios.get(use_case, ratios['General'])

# -----------------------------------------------------
# Core Logic: Generate Single Build
# -----------------------------------------------------
def generate_single_build(df, budget, use_case, strategy='balanced'):
    """
    Strategies:
    - 'value': Maximize performance but stay SAFELY (90%) within budget.
    - 'performance': Maximize performance, use 100% of budget.
    - 'future_proof': Prioritize AM5/DDR5/LGA1700, then max performance.
    """
    ratios = get_ratios(use_case)
    
    # Adjust Budget Strategy
    effective_budget = budget
    flexibility = 0.1 # Default 10%
    
    if strategy == 'value':
        effective_budget = budget * 0.90
        flexibility = 0.0 # Strict cap at 90%
    elif strategy == 'performance':
        effective_budget = budget
        # Allow max +5000 total overspend
        total_overspend = 5000
        flexibility = total_overspend / budget # e.g. 5000/100000 = 0.05 (5%)
    elif strategy == 'future_proof':
        effective_budget = budget * 1.15 # Allow 15% over for future proofing
        flexibility = 0.20 # Allow more flexibility for new tech

    selected_parts = {}
    total_price = 0
    total_score = 0
    
    # DB Mapping
    type_mapping = {
        'cpu': ['processor', 'cpu'],
        'gpu': ['gpu', 'graphics card'],
        'motherboard': ['motherboard', 'mobo'],
        'ram': ['ram', 'memory'],
        'storage': ['ssd', 'hdd', 'storage', 'hard drive'],
        'psu': ['psu', 'power supply'],
        'case': ['case', 'cabinet']
    }
    
    required_types = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case']
    
    for part_type in required_types:
        col_name = 'part' if 'part' in df.columns else 'type'
        valid_names = type_mapping.get(part_type, [part_type])
        
        # 1. Filter by Type
        type_df = df[df[col_name].str.lower().isin(valid_names)]
        if type_df.empty: continue

        # 2. Strategy Filters (Future Proofing)
        if strategy == 'future_proof':
            # Prefer DDR5 and New Sockets if possible
            if part_type == 'ram':
                ddr5_df = type_df[type_df['name'].str.contains('DDR5', case=False, na=False)]
                if not ddr5_df.empty: type_df = ddr5_df
            
            if part_type == 'motherboard':
                sock_df = type_df[type_df['socket'].str.contains('AM5|LGA1700', case=False, na=False)]
                if not sock_df.empty: type_df = sock_df

        # 3. Budget Filter
        target_budget = effective_budget * ratios.get(part_type, 0.1)
        affordable_df = type_df[type_df['price'] <= target_budget * (1.0 + flexibility)]
        
        # 4. Selection
        if affordable_df.empty:
            best_part = type_df.nsmallest(1, 'price').iloc[0] # Fallback to cheapest
        else:
            # OPTIMIZATION CHANGE:
            # For BOTH 'value' and 'performance', we want to maximize *Performance*.
            # The usage limit is handled by 'effective_budget' (90% vs 100%).
            # This ensures both use the budget fully as requested.
            best_part = affordable_df.nlargest(1, 'performance_score').iloc[0]
            
        selected_parts[part_type] = best_part.to_dict()
        total_price += best_part['price']
        total_score += best_part['performance_score']

    return {
        "parts": selected_parts,
        "totalPrice": total_price,
        "ai_score": total_score,
        "strategy": strategy
    }

# -----------------------------------------------------
# Main Optimization Function
# -----------------------------------------------------
def optimize_build(data):
    request = data.get('request', {})
    db_parts = data.get('database', [])
    
    budget = float(request.get('budget', 0))
    use_case = request.get('useCase', 'General')
    
    # 1. Prepare DF
    df = pd.DataFrame(db_parts)
    df['price'] = pd.to_numeric(df['price'], errors='coerce').fillna(0)
    
    if 'performance_score' not in df.columns:
        df['performance_score'] = 0
    else:
        df['performance_score'] = pd.to_numeric(df['performance_score'], errors='coerce').fillna(0)
    
    df['value_score'] = np.where(df['price'] > 0, (df['performance_score'] / df['price']) * 100, 0)
    
    # 2. Generate 3 Distinct Builds
    builds = {
        "value": generate_single_build(df, budget, use_case, 'value'),
        "performance": generate_single_build(df, budget, use_case, 'performance'),
        "future_proof": generate_single_build(df, budget, use_case, 'future_proof')
    }

    # 3. Return Combined Result
    return {
        "status": "success",
        "options": builds,
        "reasoning": f"Generated 3 options for {use_case} @ {budget}"
    }

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

if __name__ == "__main__":
    try:
        input_str = sys.stdin.read()
        if not input_str: raise ValueError("No input received")
        data = json.loads(input_str)
        result = optimize_build(data)
        print(json.dumps(result, cls=NumpyEncoder))
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)
