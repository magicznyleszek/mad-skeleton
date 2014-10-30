function projectInterface() {
    // declare a public run function with all private stuff initialized inside of it
    this.run = run;
    function run() {
        doSomething();
    }

    // this does something if true
    function doSomething() {
        if(true === true) {
            console.log('Hello world!');
        }
    }
}

// create a public object and start its run function
var knowYourDinosaurs = new projectInterface();
// run functions
knowYourDinosaurs.run();
