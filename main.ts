type Responce = [input: string, result: string]
type Arguments = {
    responce: Responce
    log: Responce[]
    count: number
}

const main = (answer: string, pokemons: readonly string[], userScript: string) => {
    const userScriptFactiory = new Function(`return ${userScript}`)
    const script = userScriptFactiory()

    const log: Responce[] = []
    let count = 0
    let limit = 100
    const context = {  }
    let responce: Responce = ['', 'xxxxx']
    while(count < 10 && limit) {
        limit--

        const arg: Arguments = { log: log.slice(), responce, count }
        const input = script(arg, {context, pokemonNames: pokemons.slice()})
        const result = checkInput(input, answer, pokemons)
        responce = [input, result || 'error']
        if(responce === null) continue;

        log.push(responce)
        if(result === '@@@@@') break;
        
        count++
    }

    return limit ? log : null
}

const checkInput = (input: any, correctAnswer: string, pokemons: readonly string[]): string | null => {
    if(typeof input !== 'string' || !input || input.length > 5) return null

    // ポケモン名かどうかチェック
    if(!pokemons.includes(input)) return null

    input = input.padEnd(5, '_')
    const result = ['x', 'x', 'x', 'x', 'x']

    // 位置一致を確認
    for(let i=0; i<5; i++) {
        if(input[i] === correctAnswer[i]) {
            result[i] = '@'
        }
    }

    for(let i=0; i<5; i++) {
        if(result[i] !== '@' && correctAnswer.includes(input[i]))
            result[i] = 'o'
    }
    
    return result.join('')
}
