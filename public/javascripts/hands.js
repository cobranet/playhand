var H = function () {
    var p={
    	new_hand : function(){
	           $.ajax( { type   : 'POST',
	  	             url    : '/hands' ,
		             succes : function(data){ alert(data) },
			     error  : function(data){ p.report_error(data)}
			   } 
		    ); }
	,
	report_error: function(data){ 
		      		       $("#error_msg").html(data.responseText);
				    },
	attach : function()         {
					$('#new_hand').click(p.new_hand);	 
	}	
};
    return p;
}();
$( function (){ H.attach(); });