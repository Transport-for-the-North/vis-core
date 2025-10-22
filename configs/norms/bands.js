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
            },
            {
                name: "Passengers Over Seating Capacity",
                values: [0,100, 250, 500, 1000, 2000, 5000, 7000 ],
                differenceValues: [-7000, -5000, -2000, -500, -100, 0, 100, 500, 2000, 5000, 7000],
                colours: ["#FFE5E5","#FFB3B3","#FF8080","#FF4D4D","#FF1A1A","#CC0000","#990000","#660000"]
            },
            {
                name: "Excess Seating",
                values: [0,1000, 2500, 5000, 10000, 20000, 50000, 100000, 150000],
                differenceValues: [-150000, -50000, -20000, -10000, -5000, -1000, 0, 1000, 5000, 10000, 20000, 50000, 150000],
                colours: ["#C8F7C5","#A6ECA3","#84E181","#62D65F","#40CB3D","#2FA336","#217B2A","#15531E","#0A2C12"],
            },
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
                name: "total_gen_cost",
                pageName: "Zone Benefits Total",
                values: [-20000, -5000, -1000, -500, 0, 500, 1000, 5000, 20000],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "ivt",
                pageName: "Zone Benefits Total",
                values:[-1500, -500, -100, -50, 0, 50, 100, 500, 1500],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "crowding",
                pageName: "Zone Benefits Total",
                values:[-1500, -500, -100, -50, 0, 50, 100, 500, 1500],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "wait_time",
                pageName: "Zone Benefits Total",
                values:[-1500, -500, -100, -50, 0, 50, 100, 500, 1500],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "walk_time",
                pageName: "Zone Benefits Total",
                values:[-1500, -500, -100, -50, 0, 50, 100, 500, 1500],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500]
            },
            {
                name: "penalty",
                pageName: "Zone Benefits Total",
                values:[-1500, -500, -100, -50, 0, 50, 100, 500, 1500],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "access_egress",
                pageName: "Zone Benefits Total",
                values:[-1500, -500, -100, -50, 0, 50, 100, 500, 1500],
                differenceValues: [-500, -200, -100, -50, -10, 0, 10, 50, 100, 200, 500],
            },
            {
                name: "value_of_choice",
                pageName: "Zone Benefits Total",
                values:[-1500, -500, -100, -50, 0, 50, 100, 500, 1500],
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
    },
    {   name: "Accessibility (Key Location)",
        metric: [
            {   name: 1,
                values: [0, 1, 2, 3, 4, 5, 10],
                differenceValues: [-10, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10]
            },
            {   name: 2,
                values: [0, 10, 25, 50, 100, 200, 500, 1000],
                differenceValues: [-100, -50, -25, -10, -5, 0, 5, 10, 25, 50, 100]
            },
            {   name: 3,
                values: [0, 5, 10, 20, 30, 50, 100],
                differenceValues: [-100, -50, -25, -10, -5, 0, 5, 10, 25, 50, 100]
            },
            {   name: 4,
                values: [0, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000000000],
                differenceValues: [-100000, -50000, -25000, -10000, -5000, 0, 5000, 10000, 25000, 50000, 100000]
            },
            {
                values: [0, 1, 2, 3, 4, 5, 10],
                differenceValues: [-10, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10]
            },
            {   name: 6,
                values: [0, 1, 2, 3, 4, 5, 10],
                differenceValues: [-10, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10]
            },
            {   name: 7,
                values: [0, 1, 2, 5, 10, 15, 20, 100],
                differenceValues: [-100, -50, -25, -10, -5, 0, 5, 10, 25, 50, 100]
            },
            {   name: 8,
                values: [0, 1, 2, 3, 4, 5, 10],
                differenceValues: [-10, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10]
            },
            {   name: 9,
                values: [0, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000000000],
                differenceValues: [-100000, -50000, -25000, -10000, -5000, 0, 5000, 10000, 25000, 50000, 100000]
            },
            {   name: 10,
                values: [0, 5, 10, 20, 30, 50, 100, 250, 500],
                differenceValues: [-100, -50, -25, -10, -5, 0, 5, 10, 25, 50, 100]
            },
        ]
    },
    {   name: "Accessibility (Land Use)",
        metric: [
            {   name: "emp",
                values: [0, 2500, 5000, 10000, 25000, 50000, 75000, 100000, 1000000],
                differenceValues: [-5000000, -100000, -50000, -25000, -10000, 0 , 10000, 25000, 50000, 100000, 5000000]
            },
            {   name: "pop",
                values: [0, 2500, 5000, 10000, 25000, 50000, 75000, 100000, 1000000],
                differenceValues: [-5000000, -100000, -50000, -25000, -10000, 0 , 10000, 25000, 50000, 100000, 5000000]
            }
        ]
    },
    {   name: "Accessibility (Journey Time)",
        metric: [
            {   name: "journey_time",
                pageName: "Journey Time Accessibility (Zone Pair)",
                values: [0, 15, 30, 45, 60, 90, 120, 150, 180],
                differenceValues: [-30, -20, -10 , -5, 0, 5, 10, 20, 30]
            }
        ]
    }
]