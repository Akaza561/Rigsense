/**
 * Realistic benchmark estimation from component data.
 *
 * Maps raw performance_score (0-100) + hardware specs (vram, watt, capacity)
 * to real-world approximate values:
 *   - FPS estimates for gaming (AAA titles, medium-high settings)
 *   - Cinebench-style multi-core score
 *   - Video export time (lower = better)
 *   - Storage throughput estimate
 */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/* ── helpers that map performance_score → realistic numbers ───── */

/**
 * Estimated average FPS in AAA games (medium-high settings).
 * GPU performance_score 100 ≈ RTX 4090 level.
 */
const fpsFromGpu = (gpuScore, cpuScore, vram, resolution) => {
    // base FPS calibration: score 100 → ~160fps @ 1080p
    const gpuBase = (gpuScore / 100) * 160;
    // CPU can't feed more than ~250fps realistically; it limits low-res
    const cpuCap = (cpuScore / 100) * 250;

    // resolution scaling factors (realistic for AAA titles)
    const resMult = { '1080p': 1.0, '1440p': 0.68, '4K': 0.38 };
    const mult = resMult[resolution] || 0.68;

    let fps = Math.min(gpuBase * mult, cpuCap);

    // VRAM penalty: if VRAM < recommended for resolution, fps drops
    const minVram = resolution === '4K' ? 12 : (resolution === '1440p' ? 8 : 6);
    if (vram && vram < minVram) {
        fps *= 0.75 + (vram / minVram) * 0.25;
    }

    return clamp(Math.round(fps), 8, 300);
};

/**
 * Cinebench-style multi-core score.
 * CPU perf_score 100 ≈ i9-14900K level ≈ ~2200 pts.
 */
const cinebenchFromCpu = (cpuScore) => {
    return clamp(Math.round((cpuScore / 100) * 2200), 100, 3000);
};

/**
 * Approximate video export speed multiplier.
 * Higher CPU+GPU = faster. Returns a descriptive speed multiplier.
 * score 100/100 ≈ 5.5x real-time   |   score 50/50 ≈ 1.8x
 */
const exportSpeedMultiplier = (cpuScore, gpuScore) => {
    const combined = cpuScore * 0.55 + gpuScore * 0.45;
    const multiplier = 0.5 + (combined / 100) * 5.0;
    return parseFloat(multiplier.toFixed(1));
};

/**
 * Storage throughput estimate (MB/s).
 * SSD score 85+ ≈ NVMe ≈ 3500 MB/s  |  HDD score ~40 ≈ 150 MB/s
 */
const storageThroughput = (storScore) => {
    if (!storScore) return null;
    // score 40 → 150 MB/s (HDD), 60 → 550 (SATA SSD), 85 → 3500 (NVMe), 100 → 7000
    if (storScore <= 50) return clamp(Math.round(storScore * 3.5), 80, 200);
    if (storScore <= 70) return clamp(Math.round(200 + (storScore - 50) * 22), 200, 700);
    return clamp(Math.round(700 + (storScore - 70) * 210), 700, 7500);
};

/**
 * RAM bandwidth estimate (GB/s).
 */
const ramBandwidth = (ramScore) => {
    if (!ramScore) return null;
    // DDR4-3200 ≈ 25 GB/s, DDR5-6000 ≈ 48 GB/s
    return clamp(Math.round(15 + (ramScore / 100) * 40), 12, 60);
};

/* ── Main export ─────────────────────────────────────────────── */

/**
 * @param {object} build – { parts: [{category, performance_score, watt, vram, capacity? }] }
 * @returns {object|null}
 */
export function estimateBenchmarks(build) {
    if (!build?.parts) return null;

    const get = (cat) => build.parts.find(p => p.category?.toUpperCase() === cat);

    const cpu = get('CPU');
    const gpu = get('GPU');
    const ram = get('RAM');
    const stor = get('STORAGE');

    const cpuS = cpu?.performance_score || 0;
    const gpuS = gpu?.performance_score || 0;
    const ramS = ram?.performance_score || 0;
    const stoS = stor?.performance_score || 0;
    const vram = gpu?.vram || gpu?.params?.vram || 0;

    if (cpuS === 0 && gpuS === 0) return null;

    /* Gaming FPS */
    const fps1080p = fpsFromGpu(gpuS, cpuS, vram, '1080p');
    const fps1440p = fpsFromGpu(gpuS, cpuS, vram, '1440p');
    const fps4k = fpsFromGpu(gpuS, cpuS, vram, '4K');

    /* CPU benchmark */
    const cinebench = cinebenchFromCpu(cpuS);

    /* Video export speed */
    const exportSpeed = exportSpeedMultiplier(cpuS, gpuS);

    /* Storage speed */
    const diskSpeed = storageThroughput(stoS);

    /* RAM bandwidth */
    const bandwidth = ramBandwidth(ramS);

    /* Power draw */
    const cpuW = cpu?.watt || cpu?.params?.watt || 0;
    const gpuW = gpu?.watt || gpu?.params?.watt || 0;
    const powerDraw = cpuW + gpuW + 80;

    /* Overall rating out of 10 */
    const overall = clamp(
        parseFloat(((cpuS * 0.3 + gpuS * 0.4 + ramS * 0.15 + stoS * 0.15) / 10).toFixed(1)),
        1, 10
    );

    return {
        fps1080p,
        fps1440p,
        fps4k,
        cinebench,
        exportSpeed,
        diskSpeed,
        bandwidth,
        powerDraw,
        overall,
        vram,
    };
}
