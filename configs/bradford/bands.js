export const bands = [
    {
        name: "Link",
        metric: [
            {
                name: "No. Passengers",
                values: [0, 500, 1000, 2500, 5000, 10000, 25000, 50000],
                differenceValues: [-50000, -25000, -12500, 0, 12500, 25000, 50000],
            },
            {
                name: "Total Crush Capacity",
                values: [0, 500, 1000, 2500, 5000, 10000, 25000, 50000],
                differenceValues: [-50000, -25000, -12500, 0, 12500, 25000, 50000],
            },
            {
                name: "Total Crush Load Factor",
                values: [0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 100],
                differenceValues: [-100, -0.8, -0.5, -0.2, 0, 0.2, 0.5, 0.8, 100],
            },
            {
                name: "Total Seat Capacity",
                values: [0, 500, 1000, 2500, 5000, 10000, 25000, 50000],
                differenceValues: [-50000, -25000, -12500, 0, 12500, 25000, 50000],
            },
            {
                name: "Total Seat Load Factor",
                values: [0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 100],
                differenceValues: [-100, -0.8, -0.5, -0.2, 0, 0.2, 0.5, 0.8, 100],
            },
            {
                name: "Trains per hour",
                values: [0, 1, 3, 5, 10, 20, 50, 100],
                differenceValues: [-100, -50, -25, 0, 25, 50, 100],
            }
        ]
    }, 
    {
        name: "Station",
        metric: [
            {
                name: "Boardings",
                values: [0, 500, 1000, 2500, 5000, 10000, 15000, 25000, 50000],
                differenceValues: [-50000, -5000, -1000, -500, -250, 0, 250, 500, 1000, 5000, 50000]
            },
            {
                name: "Interchanges",
                values: [0, 500, 1000, 2500, 5000, 10000, 15000, 25000, 50000],
                differenceValues: [-50000, -5000, -1000, -500, -250, 0, 250, 500, 1000, 5000, 50000],
            },
            {
                name: "Access",
                values: [0, 500, 1000, 2500, 5000, 10000, 15000, 25000, 50000],
                differenceValues: [0, 500, 1000, 2500, 5000, 10000, 15000, 25000, 50000]
            },
            {
                name: "Egress",
                values: [0, 500, 1000, 2500, 5000, 10000, 15000, 25000, 50000],
                differenceValues: [-50000, -5000, -1000, -500, -250, 0, 250, 500, 1000, 5000, 50000],
            },
            {
                name: "Alightings",
                values: [0, 500, 1000, 2500, 5000, 10000, 15000, 25000, 50000],
                differenceValues: [-50000, -5000, -1000, -500, -250, 0, 250, 500, 1000, 5000, 50000],
            },
            {
                name: "demand",
                values: [0, 50, 100, 250, 500, 750, 1000, 2000, 5000],
                differenceValues: [-1000, -500, -100, -50, -10, 0, 10, 50, 100, 500, 1000],
            },
            {
                name: "gen_cost",
                values: [0, 50, 100, 200, 400, 600, 800, 1000, 2000],
                differenceValues: [-500, -200, -100, -50, -25, 0, 25, 50, 100, 200, 500]
            },
            {
                name: "gen_jt",
                values: [0, 50, 100, 200, 400, 600, 800, 1000, 2000],
                differenceValues: [-500, -200, -100, -50, -25, 0, 25, 50, 100, 200, 500],
            },
            {
                name: "gen_cost_tot",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -25, -10, 0, 10, 25, 50, 100, 200],
            },
            {
                name: "gen_cost_car",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200],
            },
            {
                name: "gen_cost_walk",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200],
            },
            {
                name: "gen_cost_bus",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200],
            },
            {
                name: "gen_cost_lrt",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200],
            },
            {
                name: "demand_total",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200],
            },
            {
                name: "demand_car",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200],
            },
            {
                name: "demand_walk",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200]
            },
            {
                name: "demand_bus",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200],
            },
            {
                name: "demand_lrt",
                values: [0, 10, 50, 100, 250, 500, 1000, 2000],
                differenceValues: [-200, -100, -50, -20, -5, 0, 5, 20, 50, 100, 200]
            },
        ]
    },
    {
        name: "Zone",
        metric: [
            {
                name: "demand",
                pageName: "Zone Totals",
                values: [0, 500, 1000, 2500, 5000, 10000, 20000],
                differenceValues: [-500, -100, -50, -25, -10, 0, 10, 25, 50, 100, 500],
            },
            {
                name: "revenue",
                values: [-250000, -100000, -50000, -25000, 0, 25000, 50000, 100000, 250000],
                differenceValues: [-50000, -10000, -5000, -2500, -1000, 0, 1000, 2500, 5000, 10000, 50000],
            },
            {
                name: "demand",
                pageName: "Zone Pairs",
                values: [0, 50, 100, 250, 500, 750, 1000, 2000, 5000],
                differenceValues: [-1000, -500, -200, -100, -50, -10, 10, 50, 100, 200, 500, 1000]
            },
            {
                name: "gen_cost",
                values: [0, 50, 100, 200, 400, 600, 800, 1000, 2000],
                differenceValues: [-500, -200, -100, -75, -50, -25, 25, 50, 75, 100, 200, 500],
            },
            {
                name: "gen_jt",
                values: [0, 50, 100, 200, 400, 600, 800, 1000, 2000],
                differenceValues: [-500, -200, -100, -75, -50, -25, 25, 50, 75, 100, 200, 500],
            },
            {
                name: "Highway Demand",
                values: [0, 10, 50, 100, 250, 500, 1000, 1500, 2000],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "Rail Demand",
                values: [0, 10, 50, 100, 250, 500, 1000, 1500, 2000],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "Total Generalised Cost",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "IVT",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Crowding",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Wait Time",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Walk Time",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Penalty",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "Access Egress",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "Value of Choice",
                pageName: "Zone Benefits Total",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Total Generalised Cost",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "IVT",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Crowding",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Wait Time",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Walk Time",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "Penalty",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "Access Egress",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "Value of Choice",
                pageName: "Zone Benefits Pair",
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
        ]
    }
]