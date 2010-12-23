var H = function () {
    var p={
    	new_hand : function(){
	           $.ajax( { method: 'POST',
	  	             url:    '/hands' ,
		             succes: function(data){ alert(data) },
			     error: function(data){ alert(data) }
			   } 
		    ); }
	,
	
	attach : function(){
	   $('#new_hand').click(p.new_hand);	 
	}	
};
    return p;
}();
$( function (){ H.attach(); });