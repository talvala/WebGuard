

var index=[];
var j=0;

// function to replace the image with the loading temp animation image

function replaceImages(){
      index=[];
      var newurl='';
      $('img').each(function(){
            if(true){
                  if($(this).attr('src')){
                        var uri=$(this).attr('src');
                        if(uri.indexOf('http://')>-1  || uri.indexOf('https://')>-1 || uri.indexOf('www.')>-1 || uri.indexOf('data:image')>-1){
                              $(this).attr('ext-index','ext-'+j);
                              $(this).attr('org-src',$(this).attr('src'))
                              $(this).attr('src',chrome.runtime.getURL('/img/img.gif'))
                              index.push('ext-'+j)
                              j++;
                        }else{
                              if($(this).attr('src').substr(0,1)==='/'){
                                    newurl=window.location.origin+$(this).attr('src')

                              }else{
                                    newurl=window.location.origin+'/'+$(this).attr('src');
                              }
                              $(this).attr('org-src',newurl)
                              $(this).attr('src',chrome.runtime.getURL('/img/img.gif'))
                              $(this).attr('ext-index','ext-'+j)
                              index.push('ext-'+j)
                              j++;
                        }
                        $(this).attr('ext-img','yes')
                        if($(this).width() && $(this).height()){
                              $(this).css({'width':$(this).width()+'px','height':$(this).height()+'px'})
                        }
                        //$(this).css({'width':$(this).width()+'px','height':$(this).height()+'px'})
                  }
            }
      })
      $('body').css({'visibility':'visible'})
}



replaceImages();

//starting image collection process


$(document).on('mouseover','img[ext-img="yes"]',function(){
      var ourl=$(this).attr('org-src');
      var _id=$(this).attr('ext-index')

// send collected images to background - server side for analysis

        if(ourl){

        	// check what the user has chosen as protection level and blur accordingly

        	 chrome.storage.sync.get(['status'], function(status) {
				if (status) {
			          var protection_level = status.status;
		     	 }
					     	
            	if (protection_level) {

            		// if the user chose no protection

	            	if (protection_level == 'none') {

	            		console.log('recognized none')

		                  chrome.runtime.sendMessage({msg:'no_action', url:ourl},function(rd){
		                  	

		                        if(rd.status){

		                        	console.log('something went wrong')
		                        
		                        }
		                        else{
		                        		$('img[ext-index="'+_id+'"]').attr('src',ourl) // do nothing, return the src collected as is
		                        }
		                  })
					}
								

					// if the user chose medium protection

					if (protection_level == 'medium') {
				

						console.log('recognized medium')
            	
                  		chrome.runtime.sendMessage({msg: 'check', url:ourl},function(rd){

                        if(rd.status){

                        	// get the coordinates returned from the API and the offensive categories

                              var cords=rd.res.responses[0].cropHintsAnnotation.cropHints[0].boundingPoly.vertices;
                              var safe=rd.res.responses[0].safeSearchAnnotation;

                        
                              // check weather the categories indicated that the image is offensive. if it is - start blurring on top of the image


                              if(safe.violence==="LIKELY" || safe.adult==="LIKELY" || safe.spoof==="LIKELY" || safe.medical==="LIKELY" || safe.racy==="LIKELY"  || safe.violence==="VERY_LIKELY" || safe.adult==="VERY_LIKELY" || safe.spoof==="VERY_LIKELY" || safe.medical==="VERY_LIKELY" || safe.racy==="VERY_LIKELY"){
                                    
                                    var image=new Image();
                                    image.setAttribute('crossOrigin', 'anonymous');
                                    image.onload=function(){
                                          var cnvs=document.createElement('canvas'); // create canvas to represent the image
                                          cnvs.height = this.naturalHeight;
                                          cnvs.width = this.naturalWidth;
                                          var ctx=cnvs.getContext('2d'); // create context to hold the blurring mask
                                          ctx.filter = 'blur(100px)';
                                          ctx.drawImage(this, 0, 0);

                                          
                                          if (typeof cords[3].x === "undefined") {
                                          	cords[3].x = 0
                                          }
                                          if (typeof cords[3].y === "undefined") {
                                          	cords[3].y = 0
                                          }
                                          if (typeof cords[0].y === "undefined") {
                                          	cords[0].y = 0
                                          }

                              			var width = cords[2].x - cords[3].x;
                              			var height = cords[3].y - cords[0].y ;


                                          var imgData=ctx.getImageData(0,0,cords[2].x,cords[2].y);
                                          ctx.clearRect(0, 0, cnvs.width, cnvs.height);
                                          ctx.filter = 'none';
                                          ctx.drawImage(this, 0, 0);
                                          let nx=0;
                                          if(cords[0].x){
                                                nx=cords[0].x
                                          }
                                          let ny=0;
                                          if(cords[0].y){
                                                ny=cords[0].y
                                          }
                                          var newSrc=cnvs.toDataURL('image/png');
                                          ctx.putImageData(imgData, cords[0].x, cords[0].y);
                                          var newSrc=cnvs.toDataURL('image/png');
                                          $('img[ext-index="'+_id+'"]').attr('src',newSrc)
                                    }
                                    image.src=ourl;
	                              }
	                              else{
	                                    $('img[ext-index="'+_id+'"]').attr('src',ourl)
	                              }
                        
	                        }
	                        else{
	                              $(this).attr('src',$(this).attr('org-src')) // if the categories did not indicate that the image is offensive - return as it
	                        }
	                  })
	              }


	              // if the user chose high protection


  					if (protection_level == 'high') {
				
      					console.log('recognized high')

            	
                 		 chrome.runtime.sendMessage({msg: 'check', url:ourl},function(rd){

	                        if(rd.status){
	                              var cords=rd.res.responses[0].cropHintsAnnotation.cropHints[0].boundingPoly.vertices;
	                              var safe=rd.res.responses[0].safeSearchAnnotation;

                        

                              	if(safe.violence==="LIKELY" || safe.adult==="LIKELY" || safe.spoof==="LIKELY" || safe.medical==="LIKELY" || safe.racy==="LIKELY" || safe.violence==="POSSIBLE" || safe.adult==="POSSIBLE" || safe.spoof==="POSSIBLE" || safe.medical==="POSSIBLE" || safe.racy==="POSSIBLE" || safe.violence==="VERY_LIKELY" || safe.adult==="VERY_LIKELY" || safe.spoof==="VERY_LIKELY" || safe.medical==="VERY_LIKELY" || safe.racy==="VERY_LIKELY" ){
                                    var image=new Image();
                                    image.setAttribute('crossOrigin', 'anonymous');
                                    image.onload=function(){
                                          var cnvs=document.createElement('canvas');
                                          cnvs.height = this.naturalHeight;
                                          cnvs.width = this.naturalWidth;
                                          var ctx=cnvs.getContext('2d');
                                          ctx.filter = 'blur(100px)';
                                          ctx.drawImage(this, 0, 0);

                                          
                                          if (typeof cords[3].x === "undefined") {
                                          	cords[3].x = 0
                                          }
                                          if (typeof cords[3].y === "undefined") {
                                          	cords[3].y = 0
                                          }
                                          if (typeof cords[0].y === "undefined") {
                                          	cords[0].y = 0
                                          }

                              			var width = cords[2].x - cords[3].x;
                              			var height = cords[3].y - cords[0].y ;


                                          var imgData=ctx.getImageData(0,0,cords[2].x,cords[2].y);
                                          ctx.clearRect(0, 0, cnvs.width, cnvs.height);
                                          ctx.filter = 'none';
                                          ctx.drawImage(this, 0, 0);
                                          let nx=0;
                                          if(cords[0].x){
                                                nx=cords[0].x
                                          }
                                          let ny=0;
                                          if(cords[0].y){
                                                ny=cords[0].y
                                          }
                                          var newSrc=cnvs.toDataURL('image/png');
                                          ctx.putImageData(imgData, cords[0].x, cords[0].y);
                                          var newSrc=cnvs.toDataURL('image/png');
                                          $('img[ext-index="'+_id+'"]').attr('src',newSrc)
                                    }
                                    image.src=ourl;
	                              }
	                              else{
	                                    $('img[ext-index="'+_id+'"]').attr('src',ourl)
	                              }
                        
	                        }
	                        else{
	                              $(this).attr('src',$(this).attr('org-src'))
	                        }
	                  })
	              }




        	  }
          })
                  
        }


})

$('img[ext-img="yes"]').each(function(){
      $(this).trigger('mouseover')
      $(this).attr('ext-img','no')
})
setInterval(function(){
      $('video').trigger('pause');
      $('.ytp-cued-thumbnail-overlay').hide();
},10)