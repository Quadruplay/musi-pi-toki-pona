export let tools = {
    delayedFor: async function delayedForLoop(iterations, delayMs, callback) {
        let iteration = 0;
        
        function nextIteration() {
          if (iteration < iterations) {
            setTimeout(function() {
              callback(iteration);
              iteration++;
              nextIteration();
            }, delayMs);
          }
        }
      
        nextIteration();
      },
    singleKeyListener: async function addKeyListenerAndExecute(targetKey, callback, args) {
      function keyPressHandler(event) {
        if (event.key === targetKey) {
          document.removeEventListener('keydown', keyPressHandler);
          callback(...args);
        }
      }
      document.addEventListener('keydown', keyPressHandler);
    },
    multiKeyListener: async function addKeyListenerAndExecute(targetKeys, callback) {
      function keyPressHandler(event) {
        if (targetKeys.includes(event.key)) {
          document.removeEventListener('keydown', keyPressHandler);
          let keyIndex = targetKeys.indexOf(event.key);
          callback(keyIndex);
        }
      }
      document.addEventListener('keydown', keyPressHandler);
    }
}