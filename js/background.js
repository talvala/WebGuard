





      chrome.runtime.onMessage.addListener((req,sen,cb)=>{

        chrome.storage.sync.get(['status'], function(status) {
          var status_data = status.status;
          console.log('status_data: ' + status_data);
        });


          // if (status_data == 'medium' || status_data == 'high') {

            if(req.msg=='check'){
              if(req.url){
                convertToB64(req.url,(rs)=>{
                  var data={
                    requests: [{
                      image: {content:rs},
                      features: [{'type':'SAFE_SEARCH_DETECTION'}, {'type':'CROP_HINTS'}]
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
        // }
    })

//
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