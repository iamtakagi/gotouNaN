// ref: https://note.kiriukun.com/entry/20181229-numbers-to-chinese-numerals
const numbersToKanji = (num) => {
    if (num === undefined || num === null || num === '') {
        return '';
    }
    if (!(/^-?[0-9]+$/g.test(num))) {
        throw new TypeError('半角数字以外の文字が含まれています。漢数字に変換できませんでした。-> ' + num);
    }
    num = Number(num);
    if (!Number.isSafeInteger(num)) {
        throw new RangeError('数値が ' + Number.MIN_SAFE_INTEGER + ' ～ ' + Number.MAX_SAFE_INTEGER + ' の範囲外です。漢数字に変換できませんでした。-> ' + num);
    }
    if (num === 0) {
        return '零';
    }
    let ret = '';
    if (num < 0) {
        ret += 'マイナス';
        num *= -1;
    }
    const numStr = num + '';
    const kanjiNums = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const kanjiNames = ['十', '百', '千', '万', '億', '兆', '京', '垓', '𥝱', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];
    const exponents = [1, 2, 3, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68];
    const exponentsLen = exponents.length;
    for (let i = exponentsLen; i >= 0; --i) {
        const bias = Math.pow(10, exponents[i]);
        if (num >= bias) {
            const top = Math.floor(num / bias);
            if (top >= 10) {
                ret += numbersToKanji(top);
            } else {
                if (top == 1 && exponents[i] <= 3) {
                    // ※先頭の数字が1、かつ指数が3 (千の位) 以下の場合のみ『一』をつけない
                } else {
                    ret += kanjiNums[top];
                }
            }
            ret += kanjiNames[i];
            num -= top * bias;
        }
    }
    ret += kanjiNums[num];
    return ret;
};
// ref: https://labs.goo.ne.jp/api/jp/hiragana-translation/
const kanjiToHira = async (text) => {
    const base = 'https://labs.goo.ne.jp'
    const path = '/api/hiragana';
    const url = new URL(path, base);
    console.log(url.toString())
    const response = await fetch(url, {
        method: "POST",
        url,
        body: JSON.stringify({
            app_id: "a489e8dec826dbedda4939b1d4f1031a6cf967fd264f5e95191b632d82a3cf47",
            sentence: text,
            output_type: 'hiragana'
        }),
        headers: {
            'Content-Type': `application/json`,
        }
    })
    console.log(response)
    let result = (await response.json())["converted"]
    // スペースを削除
    result = result.trim().replace(/\s+/g, "");
    console.log(result)
    return result
}
window.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#generate_gotou_btn").onclick = async () => {
        document.querySelector("#result").innerText = "後藤" + await kanjiToHira(numbersToKanji(Math.floor(Math.random() * 13)) + "人") + "ちゃん"
    }
    document.querySelector("#twitter_share_btn").onclick = () => {
        const result = document.querySelector("#result").innerText;
        if (result === "\u2193\u30af\u30ea\u30c3\u30af\u3057\u3066\u306d" || result === undefined) return
        window.open(
            `https://twitter.com/intent/tweet?text=${result}` + encodeURI(`&url=https://iamtakagi.github.io/gotouNaN/`),
            "_blank",
            "noreferrer"
        )
    }
    // Copyright
    const baseYear = 2022
    const thisYear = new Date().getFullYear()
    document.querySelector("#copyright").innerHTML = `(c) ${baseYear + (baseYear == thisYear ? "" : "-" + thisYear)} <a href="https://github.com/iamtakagi">iamtakagi</a>`
})