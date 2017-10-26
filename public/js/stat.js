$(document).ready(function() {
	$.ajax({
		url: "/api/stat/stat",
		type: "post",
		contentType: "application/json",
		dateType: "json",
		success: function(result) {
			console.log(result)
				// var rev = JSON.parse(result);
			$('#table_id').DataTable({
				"paging": false,
				"order": [
					[0, "desc"]
				],
				data: result.data,
				footerCallback: function(row, data, start, end, display) {
					var api = this.api(),
						data;

					// Remove the formatting to get integer data for summation
					var intVal = function(i) {
						return typeof i === 'string' ?
							i.replace(/[\$,]/g, '') * 1 :
							typeof i === 'number' ?
							i : 0;
					};

					// Total over all pages
					total = api
						.column(1)
						.data()
						.reduce(function(a, b) {
							return intVal(a) + intVal(b);
						});

					// Total over this page
					pageTotal = api
						.column(1, {
							page: 'current'
						})
						.data()
						.reduce(function(a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Update footer
					$(api.column(1).footer()).html(
						pageTotal
					);
				}
			});
		},
	});
});