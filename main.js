"use strict";
const main = (answer, pokemons, userScript) => {
    const userScriptFactiory = new Function(`return ${userScript}`);
    const script = userScriptFactiory();
    const log = [];
    let count = 0;
    let limit = 100;
    const context = {};
    let responce = null;
    while (count < 10 && limit) {
        limit--;
        const arg = { log: log.slice(), responce, count };
        const input = script(arg, { context, pokemonNames: pokemons.slice() });
        const result = checkInput(input, answer, pokemons);
        responce = (result != null) ? [input, result] : null;
        if (responce === null)
            continue;
        log.push(responce);
        if (result === '@@@@@')
            break;
        count++;
    }
    return limit ? log : null;
};
const checkInput = (input, correctAnswer, pokemons) => {
    if (typeof input !== 'string' || !input || input.length > 5)
        return null;
    // ポケモン名かどうかチェック
    if (!pokemons.includes(input))
        return null;
    input = input.padEnd(5, '_');
    const result = ['x', 'x', 'x', 'x', 'x'];
    // 位置一致を確認
    for (let i = 0; i < 5; i++) {
        if (input[i] === correctAnswer[i]) {
            result[i] = '@';
        }
    }
    for (let i = 0; i < 5; i++) {
        if (result[i] !== '@' && correctAnswer.includes(input[i]))
            result[i] = 'o';
    }
    return result.join('');
};
