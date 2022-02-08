"use strict";
const main = (answer, pokemons, userScript) => {
    const userScriptFactiory = new Function(`return ${userScript}`);
    const script = userScriptFactiory();
    const log = [];
    let count = 0;
    let limit = 100;
    while (count < 10 && limit) {
        limit--;
        const input = script({ log: [...log], count });
        const res = checkInput(input, answer, pokemons);
        if (res === null)
            continue;
        log.push([input, res]);
        if (res === '@@@@@')
            break;
        count++;
    }
    const logger = document.getElementById('logger');
    logger.innerHTML = limit ?
        log.map(([input, result], i) => `<p>${i + 1}, input: ${input}, result: ${result}</p>`).join('') + `<p>answer: ${answer}</p>` :
        "limit over...";
};
const checkInput = (input, correctAnswer, pokemons) => {
    if (typeof input !== 'string' || !input || input.length > 5)
        return null;
    // ポケモン名かどうかチェック
    if (!pokemons.includes(input))
        return null;
    input = input.padEnd(5, '_');
    const result = correctAnswer.split('');
    // 位置一致を確認
    for (let i = 0; i < 5; i++) {
        if (input[i] === correctAnswer[i]) {
            result[i] = '@';
        }
    }
    for (let i = 0; i < 5; i++) {
        if (result[i] === '@')
            continue;
        if (result.includes(input[i]))
            result[i] = 'o';
    }
    return result.map((s) => '@o'.includes(s) ? s : 'x').join('');
};
