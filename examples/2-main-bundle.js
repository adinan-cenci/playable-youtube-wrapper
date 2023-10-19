(()=>{"use strict";class t extends HTMLElement{constructor(){super(),this.state={isPaused:!1,isPlaying:!1,isReproducing:!1,isBuffering:!1,isWaiting:!1,isEnded:!1,volume:100}}appendTo(t){return t.append(this),new Promise((async(t,e)=>t()))}prependTo(t){return t.prepend(this),new Promise((async(t,e)=>t()))}appendAfter(t){return t.after(this),new Promise((async(t,e)=>t()))}get isPaused(){return this.state.isPaused}get isPlaying(){return this.state.isPlaying}get isReproducing(){return this.state.isReproducing}get isWaiting(){return this.state.isWaiting}get isBuffering(){return this.state.isBuffering}get isEnded(){return this.state.isEnded}get volume(){return this.state.volume}get currentTime(){}get currentTimeFormatted(){return t.secondsToStringRepresentation(this.currentTime)}get currentTimePercentage(){var t,e;return t=Math.round(this.currentTime),e=Math.round(this.duration),isNaN(t)||isNaN(e)||0==t||0==e?0:t/e*100}get remainingTime(){return this.duration-this.currentTime}get remainingTimeFormatted(){return t.secondsToStringRepresentation(this.remainingTime)}get remainingTimePercentage(){return 100-this.currentTimePercentage}get duration(){}get durationFormatted(){return t.secondsToStringRepresentation(this.duration)}getTime(t){return Math.round(this.duration/100*t)}getTimeFormatted(e){return t.secondsToStringRepresentation(this.getTime(e))}getPercentage(e){return("string"==typeof e&&e.indexOf(":")>=0?t.stringRepresentationToSeconds(e):parseFloat(e))/this.duration*100}seek(t){}play(t=null){}pause(){}toggle(){this.isPlaying?this.pause():this.play()}sanitizeGetSeconds(e){var i;return i="string"==typeof e&&e.indexOf(":")>=0?t.stringRepresentationToSeconds(e):"string"==typeof e&&e.indexOf("%")>=0?this.getTime(parseInt(e)):"string"==typeof e?parseInt(e):e,isNaN(i)&&(i=0),i}fireEvent(t,e,i=!0){var s={bubbles:i};null!=e&&(s.detail=e);var r=new CustomEvent(t,s);return this.dispatchEvent(r)}log(t){console.log(t)}static secondsToStringRepresentation(t){return isNaN(t)?"00:00":(t=Math.round(t),n=(r=(r=(i=Math.floor(t/60))-60*(e=Math.floor(i/60)))<10?"0"+r:r)+":"+(a=(a=t-60*i)<10?"0"+a:a),n=(s=e)>0?s+":"+n:n);var e,i,s,r,a,n}static stringRepresentationToSeconds(t){var e,i,s;return!((e=t.match(/[0-9]+/g)).length>3)&&(s=parseInt(e[e.length-1]),i=parseInt(e[e.length-2]||0),3600*parseInt(e[e.length-3]||0)+60*i+s)}}const e=t,i=class{static async loadExternalJs(t,e=null){return new Promise((async function(i,s){var r;(r=document.createElement("script")).async=!0,r.type="text/javascript",r.onload=function(t){i("SCRIPT: loaded")},r.onerror=function(t){s("SCRIPT: failed to load")},r.src=t,(e=e||document.body).appendChild(r)}))}};class s extends e{static sdkLoaded=!1;static sdkLoading=!1;static sdkPromise=null;static defaults={width:640,height:null};constructor(){super(),this.state.currentTime=0,this.state.playerInitialized=!1;var t={embbedId:"youtube-embbed-"+Math.floor(1e4*Math.random()),id:null};this.settings={...s.defaults,...t},this.html={},this.follower=null}connectedCallback(){var t,e,i,r;if(!this.html.embed)return this.html.embed=this.createDiv(this.settings.embbedId,this),(t=this.getAttribute("src"))&&(this.src=t),(e=this.getAttribute("video-id"))&&(this.videoId=e),(i=this.getAttribute("width"))&&(this.width=i),(r=this.getAttribute("height"))&&(this.height=r),this.readyToPlayPromise=s.loadSdk().then((()=>this.initializePlayer()))}remove(){this.html.ytPlayer&&this.html.ytPlayer.destroy(),super.remove()}appendTo(t){return t.append(this),this.readyToPlayPromise}prependTo(t){return t.prepend(this),this.readyToPlayPromise}appendAfter(t){return t.after(this),this.readyToPlayPromise}set src(t){this.settings.id=s.getIdFromUrl(t)}set videoId(t){this.settings.id=t}set width(t){this.settings.width=parseInt(t),this.updateDimensions()}set height(t){this.settings.height=parseInt(t),this.updateDimensions()}updateDimensions(){if(this.html.ytPlayer){var t=this.settings.width,e=this.settings.height;t="auto"==t||"100%"==t?this.offsetWidth:t,e=null==e?t/1.77:e;var i=this.html.ytPlayer.getIframe();i.width=t,i.height=e}}get currentTime(){return this.state.currentTime}get duration(){return this.html.ytPlayer&&this.html.ytPlayer.getDuration?this.html.ytPlayer.getDuration():0}seek(t){if(!this.state.playerInitialized)return!1;var e=this.sanitizeGetSeconds(t);this.html.ytPlayer.seekTo(e,!0)}play(t=null){if(t&&this.seek(t),!this.state.playerInitialized)return!1;this.html.ytPlayer.playVideo()}pause(){if(!this.state.playerInitialized)return!1;this.html.ytPlayer.pauseVideo()}setVolume(t){this.state.volume=t,this.state.playerInitialized&&this.html.ytPlayer.setVolume(t)}async initializePlayer(){return new Promise((async(t,e)=>{var i=this.settings.width,r=this.settings.height;i="auto"==i?this.offsetWidth:i,r=null==r?i/1.77:r,this.html.ytPlayer=new YT.Player(this.settings.embbedId,{width:i,height:r,videoId:this.settings.id,startSeconds:0,host:"https://www.youtube.com",playerVars:{autoplay:1,controls:0},events:{onReady:e=>{t(this),this.setVolume(this.volume),this.state.playerInitialized=!0},onError:t=>{var i=s.getErrorDescription(t.data);e(i),this.fireEvent("player:error",{errorCode:t.data,errorMessage:i})},onStateChange:this.callBackOnStateChange.bind(this)}})}))}callBackOnStateChange(t){switch(t.data){case-1:this.state.isReproducing=!1,this.state.isPlaying=!1,this.state.isPaused=!1;break;case 0:this.state.isReproducing=!1,this.state.isPlaying=!1,this.state.isPaused=!0,this.state.isWaiting=!1,this.state.isEnded=!0,this.stopFollowing(),this.fireEvent("player:ended");break;case 1:var e=this.state.isWaiting;this.state.isReproducing=!0,this.state.isPlaying=!0,this.state.isPaused=!1,this.state.isBuffering=!1,this.state.isWaiting=!1,this.state.isEnded=!1,this.startFollowing(),e?this.fireEvent("player:playing"):this.fireEvent("player:play");break;case 2:this.state.isReproducing=!1,this.state.isPlaying=!1,this.state.isPaused=!0,this.state.isWaiting=!1,this.fireEvent("player:pause");break;case 3:this.state.isReproducing=!1,this.state.isPlaying=!0,this.state.isPaused=!1,this.state.isBuffering=!0,this.state.isWaiting=!0,this.fireEvent("player:waiting");break;case 5:this.play(0),this.fireEvent("player:play")}}startFollowing(){this.follower=setInterval(this.following.bind(this),1e3)}stopFollowing(){clearInterval(this.follower)}following(){var t=this.html.ytPlayer&&this.html.ytPlayer.getCurrentTime?this.html.ytPlayer.getCurrentTime():0;t!=this.currentTime&&(this.state.currentTime=t,this.fireEvent("player:timeupdate"))}static getErrorDescription(t){switch(t){case"2":return"Error 2: invalid parameters.";case"5":return"Error 5: An error related to the HTML5 player occurred.";case"100":return"Error 100: Video not found.";case"101":case"150":return"Error 101: The video's owner won't allow it on embbed players."}return"Error "+t+": Unknown error"}static getIdFromUrl(t){var e;return(e=t.match(/v=([A-Za-z0-9-_]+)/))||(e=t.match(/\.be\/([A-Za-z0-9-_]+)/))||(e=t.match(/embed\/([A-Za-z0-9-_]+)/))?e[1]:null}static async loadSdk(){return s.sdkLoaded?new Promise((async(t,e)=>{t()})):s.sdkDefined()?(s.sdkLoaded=!0,new Promise((async(t,e)=>{t()}))):s.sdkLoading?s.sdkPromise:(s.sdkLoading=!0,s.sdkPromise=new Promise((async(t,e)=>{i.loadExternalJs("https://www.youtube.com/iframe_api").then(s.loadSdkSuccess(t),s.loadSdkFail(e))})))}static sdkDefined(){return"undefined"!=typeof YT&&void 0!==YT.Player}static loadSdkSuccess(t){return()=>{s.waiter=setInterval((()=>{s.sdkDefined()&&(s.sdkLoaded=!0,clearInterval(s.waiter),s.sdkLoading=!1,t("YouTube SDK ready"))}),500)}}static loadSdkFail(t){return()=>{s.sdkLoading=!1,t("Error loading SDK")}}createDiv(t,e){var i=document.createElement("div");return i.id=t,e.append(i),i}}const r=s;customElements.define("youtube-player",r),document.addEventListener("DOMContentLoaded",(function(){window.player1=document.createElement("youtube-player"),window.player2=document.createElement("youtube-player"),window.player1.videoId="AMsoH4cOTNM",window.player1.appendTo(document.body),window.player2.videoId="GeLyv5f3XiQ",window.player2.appendTo(document.body)}))})();