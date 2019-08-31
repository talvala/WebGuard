var apiKey='';

	//create a listener to get massages from the Contect Script

      chrome.runtime.onMessage.addListener((req,sen,cb)=>{


          // if (status_data == 'medium' || status_data == 'high') {

          	if (req.msg == 'no_action') {

          		console.log('none is done')
          		cb({status:false})
          		return true;

          	}

            if(req.msg=='check'){

              if(req.url){

                convertToB64(req.url,(rs)=>{
                  var data={
                    requests: [{
                      image: {content:rs},
                      features: [{'type':'SAFE_SEARCH_DETECTION'}, {'type':'CROP_HINTS'}],
                      imageContext: { "cropHintsParams": {"aspectRatios": [ 0.8, 1, 1.2] }}
                    }]
                  }
                  
                  //send ajax request
                  var ajx=new XMLHttpRequest();
                  ajx.open('POST','https://vision.googleapis.com/v1/images:annotate?key='+apiKey,true);
                  ajx.setRequestHeader('Content-Type', 'application/json');
                  ajx.onreadystatechange=function(){
                    if(ajx.readyState!=4){

                      return ;
                    }
                    if(ajx.status>=400){

                      console.log('ajax request faild due to' + ajx.responseText)
                      return
                    }
                    cb({status:true,res:JSON.parse(ajx.responseText)})
                  }
              
                  ajx.send(JSON.stringify(data))

                })
                return true
              }
            }
    })

// in order to send an image to analysis by Google API - need to convert it to 64Base

function convertToB64(u,c){

  var img=new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload=function(){

    var cnvs=document.createElement('canvas');
    cnvs.height = this.naturalHeight;
    cnvs.width = this.naturalWidth;
    cnvs.getContext('2d').drawImage(this, 0, 0);
    var b64data=cnvs.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
    c(b64data);
  }
  img.src=u;
}