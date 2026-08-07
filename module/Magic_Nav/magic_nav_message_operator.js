import magicNavMessages from "../../renderer/configMagicNav/config_Magic_Nav_Message.js";


function emit(sourceWindow, targetWindow, message){
 
  if(!sourceWindow) {
    throw new Error(
      "Magic_Nav : emit () expects a source window. "
    );
  }

  if(!targetWindow) {
    throw new Error(
      "Magic_Nav : emit () expects a target window "
    );
  }

  console.log("[Magic_Nav] EMIT", message.type, message);

  targetWindow.postMessage(message, "*");

}

function receive(targetWindow, callback) {

  if(!targetWindow) {
    throw new Error(
      "Magic_Nav : receive() expects a target window. "
    );
  }

  if(typeof callback !== "function"){
    throw new Error(
      "Magic_Nav : receive() expects a callback"
    );
  }

  targetWindow.addEventListener("message", event => {

    console.log("[Magic_Nav] RECEIVE", event.data.type, event.data);
    
    callback(event);
  });

}

export {emit, receive, magicNavMessages};
