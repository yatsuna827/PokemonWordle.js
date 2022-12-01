type Responce = [input: string, result: string]
type Arguments = {
  responce: Responce
  log: Responce[]
  count: number
}

const main = (answer: string, pokemons: readonly string[], userScript: string) => {
  const userScriptFactiory = new Function(`return ${userScript}`)
  const script = userScriptFactiory()

  if (typeof script !== 'function') throw new Error('入力されたスクリプトが不正です。')
  if (script.length > 2) throw new Error('期待される引数が多すぎやしませんか？')

  const log: Responce[] = []
  let count = 0
  let limit = 100
  const context = {}
  let responce: Responce = ['', 'xxxxx']
  while (count < 10 && limit) {
    limit--

    const arg: Arguments = { log: log.slice(), responce, count }
    const input = script(arg, { context, pokemonNames: pokemons.slice() })
    const result = checkInput(input, answer, pokemons)
    responce = [input, result || 'error']
    if (result === null) continue

    log.push(responce)
    if (result === '@@@@@') break

    count++
  }

  return limit ? log : null
}

const checkInput = (input: unknown, correctAnswer: string, pokemons: readonly string[]): string | null => {
  if (typeof input !== 'string' || !input || input.length > 5) return null

  // ポケモン名かどうかチェック
  if (!pokemons.includes(input)) return null

  const filled = input.padEnd(5, '_')
  const answer = correctAnswer.split('')
  const result = ['x', 'x', 'x', 'x', 'x']

  // 位置一致を確認
  for (let i = 0; i < 5; i++) {
    if (filled[i] === answer[i]) {
      result[i] = answer[i] = '@'
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] !== '@') {
      const k = answer.findIndex((_) => _ === filled[i])
      if (k !== -1) result[i] = answer[k] = 'o'
    }
  }

  return result.join('')
}

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
})
editor.getDoc().setValue(defaultScript)

const onPlayButtonClicked = () => {
  editor.save()

  const pool = five

  const rand = Math.floor(Math.random() * pool.length)

  const results = main(pool[rand], pokemonNames, document.getElementById('editor').value)

  if (results) {
    for (let i = 0; i < 10; i++) {
      renderResultRow(results[i], i)
    }
  } else {
    alert('実行中にエラーが発生しました。スクリプトに誤りがあるか、実行に時間がかかりすぎている可能性があります。')
  }
}

const onPlayButton2Clicked = () => {
  editor.save()

  const results = []
  let max = -Infinity
  let min = Infinity
  let sum = 0
  const container = document.getElementById('score-attack-result-container')
  for (let k = 0; k < 10; k++) {
    let score = 0
    for (let i = 0; i < 100; i++) {
      const rand = Math.floor(Math.random() * five.length)
      const log = main(five[rand], pokemonNames, document.getElementById('editor').value)
      if (log == null) {
        score -= 100
        console.log('limit over... answer:' + five[rand])
      } else score += log[log.length - 1][1] === '@@@@@' ? 11 - log.length : 0
    }
    if (score > max) max = score
    if (score < min) min = score
    sum += score
    results.push(`<p>${k + 1} score: ${score}</p>`)
  }
  results.push(`<p>min: ${min}</p>`)
  results.push(`<p>max: ${max}</p>`)
  results.push(`<p>avg: ${sum / 10}</p>`)
  container.innerHTML = results.join('')
}

const renderResultRow = (res: Responce | undefined, i: number) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nameDivs = document.getElementById(`result${i}`)!.childNodes

  if (res) {
    const [input, result] = res

    for (let i = 0; i < 5; i++) {
      const div = nameDivs[i] as HTMLDivElement
      div.className = 'box ' + { x: 'gray', o: 'yallow', '@': 'green' }[result[i]]
      div.textContent = input[i]
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const div = nameDivs[i] as HTMLDivElement
      div.className = 'box blank'
      div.textContent = ''
    }
  }
}

function changeTab(this: HTMLInputElement) {
  if (this.value === 'normal') {
    document.getElementById('normal-mode-tab').classList.remove('inactive')
    document.getElementById('score-attack-mode-tab').classList.add('inactive')
  } else if (this.value === 'score-attack') {
    document.getElementById('normal-mode-tab').classList.add('inactive')
    document.getElementById('score-attack-mode-tab').classList.remove('inactive')
  }
}

document.getElementById('play-button').onclick = onPlayButtonClicked
document.getElementById('play-button2').onclick = onPlayButton2Clicked
document.querySelectorAll<HTMLInputElement>("input[type='radio'][name='mode']").forEach((e) => e.addEventListener('change', changeTab))

{
  const normalModeInput = document.querySelector<HTMLInputElement>("input[type='radio'][name='mode'][value='normal']")
  if (normalModeInput) normalModeInput.checked = true
}
