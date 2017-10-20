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
			});
		},
	});
});