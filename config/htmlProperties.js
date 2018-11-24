const ids = {
  "Lanzamisiles": 'details401',
  "Láser pequeño": 'details402'
};
configGeneral = {
	"KaoX": {
		"deff": {
			"orden": [9, 1, 2, 3, 6, 7, ],
			"cantidad": 500
		}		
	},
	"const": {
		"nombres": {
			"es": [
				"Lanzamisiles",
		        "Láser pequeño",
		        "Láser grande",
		        "Cañón Gauss",
		        "Cañón iónico",
		        "Cañón de plasma",
		        "Cúpula pequeña de protección",
		        "Cúpula grande de protección",
		        "Misiles antibalísticos",
		        "Misil interplanetario"
		       ]
			}
		},
		"ids": [
			"details401",
	        "details402",
	        "details403",
	        "details404",
	        "details405",
	        "details406",
	        "details407",
	        "details408",
	        "details502",
	        "details503"
		],
		"proporcion": [1/5, 1, 1/4, 1/30, 1/12, 1/100, "max", "max", "max", 0]
	},
	getUsuario: function() { //TODO
		return "KaoX";
	}
}
	