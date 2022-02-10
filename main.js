"use strict";
const main = (answer, pokemons, userScript) => {
    const userScriptFactiory = new Function(`return ${userScript}`);
    const script = userScriptFactiory();
    if (typeof script !== 'function')
        throw new Error('入力されたスクリプトが不正です。');
    if (script.length > 2)
        throw new Error('期待される引数が多すぎやしませんか？');
    const log = [];
    let count = 0;
    let limit = 100;
    const context = {};
    let responce = ['', 'xxxxx'];
    while (count < 10 && limit) {
        limit--;
        const arg = { log: log.slice(), responce, count };
        const input = script(arg, { context, pokemonNames: pokemons.slice() });
        const result = checkInput(input, answer, pokemons);
        responce = [input, result || 'error'];
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
    const answer = correctAnswer.split('');
    const result = ['x', 'x', 'x', 'x', 'x'];
    // 位置一致を確認
    for (let i = 0; i < 5; i++) {
        if (input[i] === answer[i]) {
            result[i] = answer[i] = '@';
        }
    }
    for (let i = 0; i < 5; i++) {
        if (result[i] !== '@') {
            const k = answer.findIndex(_ => _ === input[i]);
            if (k !== -1)
                result[i] = answer[k] = 'o';
        }
    }
    return result.join('');
};
