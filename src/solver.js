class SolverService {
    constructor(algorithms, objective, validate, minimize=true, logging=true) {
        this.algorithms = algorithms;
        this.currentAlgorithm = null;
        this.logging = logging;
        this.minimize = minimize;
        this.objective = objective;
        this.validate = validate;
    }

    progress(current, total) {
        if (current && total) {
            const ratio = current / total;
            const format = (100 * ratio).toFixed(1)+'% ('+current+' uit '+total+' mogelijkheden bekeken)';
            postMessage({type: 'progress', payload: {state: 'running', progress: ratio, current, total, progressMsg: format, indeterminate: true, algorithm: this.currentAlgorithm}});
        }
        else {
            postMessage({type: 'progress', payload: {state: 'running', progress: 0, progressMsg: 'Berekenen...', indeterminate: true, algorithm: this.currentAlgorithm}});
        }    
    }

    finish(optimal) {
        if (optimal) {
            postMessage({type: 'progress', payload: {state: 'optimal', progress: 1, progressMsg: 'Best mogelijke gevonden.', algorithm: this.currentAlgorithm}});
            this.optimal = true;
        }
        else {
            postMessage({type: 'progress', payload: {state: 'done', progress: 1, progressMsg: 'Klaar.', algorithm: this.currentAlgorithm}});
        }
    }

    solution(solution) {
        if (this.validate && !validate(solution)) {
            this.warn(`Algorithm ${this.currentAlgorithm} produced an invalid solution. It was rejected.`, solution);
            return;
        }
        if (this.objective) {
            
        }
        postMessage({type: 'solution', payload: solution, algorithm: this.currentAlgorithm});
    }

    reset() {
        this.bestSolution = null;
        this.bestValue = null;
        this.lowerBound = null;
        this.upperBound = null;
        this.optimal = false;
        this.logging = logging;
    }

    log(...msg) {
        if (this.logging) {
            console.log(...msg);
        }
    }

    warn(...msg) {
        if (this.logging) {
            console.warn(msg);
        }
    }

    solve(instance) {
        this.reset();
        for (let algorithm of this.algorithms) {
            const start = Date.now();
            if (algorithm.eligable && !algorithm.eligable(instance)) {
                this.log(`Skipping algorithm ${algorithm.name} as it is not suitable for this instance.`);
                continue;
            }
            this.currentAlgorithm = algorithm.name;
            this.log(`Running algorithm ${algorithm.name}`);
            this.progress();
            algorithm.run(instance, this);
            this.currentAlgorithm = null;
            const end = Date.end();
            const seconds = (end-start)/1000;
            this.log(`Algorithm ${algorithm.name} finished running after ${seconds} seconds`);
            if (this.optimal) {
                this.log(`Optimal solution found. No more algorithms will be executed`)
                return;
            }
        }
    }
}

/*
addEventListener('message', event => {
    const instance = event.data;
    //let sol = utils.dummy_solver(data.sizes);
    //callbacks.solution(sol);
    progressCallback(0,1);
    let sol = solve_localsearch(data.matrix, data.sizes).bestDivision;
    callbacks.solution(sol);
    console.log(sol);
    finishCallback();
    const cost_fn = enumerate.matrix_to_cost_fn(data.matrix);
    sol = enumerate.minimize(data.sizes, cost_fn, callbacks);
    console.log(sol);
    finishCallback(true);

    // Old timeout based code
    
    // setTimeout(() => {
    //     let sol = solve_localsearch(data.matrix, data.sizes).bestDivision;
    //     callbacks.solution(sol);
    //     finishCallback();
    // }, 1500);
});
*/