const appNames = ['bsip', 'noham', 'norms']

export const bands = await loadBands();

async function loadBands() { 
    const bandings = [];
    for (const appName of appNames) {
        try {
            const bandsModule = await import(`../${appName}/bands.js`);
            if (bandsModule.bands) {
                bandings.push(...bandsModule.bands);
            }
        } catch (error) {
            console.error(`Failed to load bands for ${appName}:`, error);
        }
    }
    const map = new Map();
    bandings.forEach(band => {
        if (map.has(band.name)) {
            const existing = map.get(band.name);
            existing.metric.push(...band.metric);
        } else {
            map.set(band.name, {...band});
        }
    });
    return Array.from(map.values());
}
