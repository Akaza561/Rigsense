import sys
import json
import pandas as pd
import numpy as np

def optimize_build(data):
    """
    The Core AI Logic.
    Uses Pandas/Numpy to select the best parts based on Value Score.
    """
    request = data.get('request', {})
    db_parts = data.get('database', [])
    
    budget = float(request.get('budget', 0))
    use_case = request.get('useCase', 'General')
    
    # 1. Convert Database to DataFrame
    df = pd.DataFrame(db_parts)
    
    # Ensure numeric types
    # Ensure numeric types
    df['price'] = pd.to_numeric(df['price'], errors='coerce').fillna(0)
    
    # Handle 'performance_score' (Check if exists, else default to 0)
    if 'performance_score' not in df.columns:
        df['performance_score'] = 0
    else:
        df['performance_score'] = pd.to_numeric(df['performance_score'], errors='coerce').fillna(0)
    
    # 2. Calculate Value Score (Performance / Price)
    # Avoid division by zero
    df['value_score'] = np.where(df['price'] > 0, (df['performance_score'] / df['price']) * 100, 0)
    
    # 3. Define Budget Ratios based on Use Case
    # 3. Define Budget Ratios based on Use Case
    ratios = {
        'Gaming': {'gpu': 0.45, 'cpu': 0.20, 'ram': 0.10, 'motherboard': 0.10, 'psu': 0.05, 'storage': 0.05, 'case': 0.05},
        'Productivity': {'cpu': 0.40, 'gpu': 0.20, 'ram': 0.15, 'storage': 0.10, 'motherboard': 0.10, 'psu': 0.05, 'case': 0.05},
        'General': {'cpu': 0.30, 'gpu': 0.10, 'ram': 0.20, 'storage': 0.15, 'motherboard': 0.10, 'psu': 0.10, 'case': 0.05}
    }
    
    current_ratios = ratios.get(use_case, ratios['General'])
    
    selected_parts = {}
    total_price = 0
    total_score = 0
    
    # 4. Map DB 'part' names to our Standard Types
    # DB: processor, gpu, motherboard, ram, ssd, psu, case
    # AI: cpu, gpu, motherboard, ram, storage, psu, case
    
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
        # Filter by normalized type
        # Check if 'part' column exists, if not try 'type' (fallback for dummy data)
        col_name = 'part' if 'part' in df.columns else 'type'
        
        valid_names = type_mapping.get(part_type, [part_type])
        
        # Filter rows where column value allows for the part type
        type_df = df[df[col_name].str.lower().isin(valid_names)]
        
        if type_df.empty:
            continue
            
        # Filter by Budget Bucket
        target_budget = budget * current_ratios.get(part_type, 0.1)
        affordable_df = type_df[type_df['price'] <= target_budget * 1.2] # Allow 20% flexibility
        
        if affordable_df.empty:
            # If nothing fits, take the cheapest option
            best_part = type_df.nsmallest(1, 'price').iloc[0]
        else:
            # OPTIMIZATION CHANGE:
            # Instead of just picking "Best Value" (which favors cheap parts),
            # we pick the "Best Performance" that fits in the budget.
            # This ensures higher budgets get better parts.
            best_part = affordable_df.nlargest(1, 'performance_score').iloc[0]
            
        selected_parts[part_type] = best_part.to_dict()
        total_price += best_part['price']
        total_score += best_part['performance_score'] # Use raw performance score for total

    # 5. Return Result
    response = {
        "status": "success",
        "build": selected_parts,
        "totalPrice": total_price,
        "ai_score": total_score,
        "reasoning": f"Optimized for {use_case} with a focus on Maximum Performance within Budget."
    }
    
    return response

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
        # 1. Read JSON from Node.js (stdin)
        input_str = sys.stdin.read()
        
        if not input_str:
            raise ValueError("No input received")
            
        data = json.loads(input_str)
        
        # 2. Run Logic
        result = optimize_build(data)
        
        # 3. Send JSON back to Node.js (stdout)
        print(json.dumps(result, cls=NumpyEncoder))
        
    except Exception as e:
        # Handle errors gracefully so Node.js knows what happened
        error_response = {
            "status": "error",
            "message": str(e)
        }
        print(json.dumps(error_response))
        sys.exit(1)
