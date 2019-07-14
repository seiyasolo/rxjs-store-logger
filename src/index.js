const repeat = (str, times) => (new Array(times + 1)).join(str);
const pad = (num, maxLength) => repeat(`0`, maxLength - num.toString().length) + num;

//使用新的性能API可以获得更好的精度（如果可用）
const timer = typeof performance !== `undefined` && typeof performance.now === `function` ? performance : Date;

function createLogger(options = {}) {
    return ({
        getState
    }) => (next) => (action) => {
        const {
            level, //级别
            logger, //console的API
            collapsed, //
            predicate, //logger的条件
            duration = false, //打印每个action的持续时间
            timestamp = true, //打印每个action的时间戳
            transformer = state => state, //在打印之前转换state
            actionTransformer = actn => actn, //在打印之前转换action
        } = options;

        const console = logger || window.console;

        // 如果控制台未定义则退出
        if (typeof console === `undefined`) {
            return next(action);
        }

        // 如果谓词函数返回false，则退出
        if (typeof predicate === `function` && !predicate(getState, action)) {
            return next(action);
        }

        const started = timer.now();
        const prevState = transformer(getState());

        const returnValue = next(action);
        const took = timer.now() - started;

        const nextState = transformer(getState());

        // 格式化
        const time = new Date();
        const isCollapsed = (typeof collapsed === `function`) ? collapsed(getState, action) : collapsed;

        const formattedTime = timestamp ? ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}` : ``;
        const formattedDuration = duration ? ` in ${took.toFixed(2)} ms` : ``;
        const formattedAction = actionTransformer(action);
        const message = `action ${formattedAction.type}${formattedTime}${formattedDuration}`;
        const startMessage = isCollapsed ? console.groupCollapsed : console.group;

        // 渲染
        try {
            startMessage.call(console, message);
        } catch (e) {
            console.log(message);
        }

        if (level) {
            console[level](`%c prev state`, `color: #9E9E9E; font-weight: bold`, prevState);
            console[level](`%c action`, `color: #03A9F4; font-weight: bold`, formattedAction);
            console[level](`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);
        } else {
            console.log(`%c prev state`, `color: #9E9E9E; font-weight: bold`, prevState);
            console.log(`%c action`, `color: #03A9F4; font-weight: bold`, formattedAction);
            console.log(`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);
        }

        try {
            console.groupEnd();
        } catch (e) {
            console.log(`—— log end ——`);
        }

        return returnValue;
    };
}

export default createLogger;