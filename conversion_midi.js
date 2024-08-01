let s = '';
const readAsArrayBufferReader = file => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject('Unknown error occurred during reading the file');
    };

    reader.onload = () => {
      console.log('onload');
      resolve(reader.result);
    };

    reader.readAsArrayBuffer(file);
  });
};

window.addEventListener('load', () => {
  const f = document.getElementById('file1');
  f.addEventListener('change', evt => {
    const input = evt.target;
    if (input.files.length == 0) {
      return;
    }
    let file = input.files[0];
    console.log(file);
    if (!file) {
      return;
    }
/*    if (file.size > 50 * 1024) {
      alert('Please select a file smaller than 50kb.');
      return;
    }
*/
    readAsArrayBufferReader(file)
      .then(buff => {
        s = '';
        console.log(buff);
        let a = new Uint8Array(buff);
        for (let i = 0; i * 16 < a.length; i++) {
          let line = '';
          let p = i * 16;
          let b = a.slice(p, Math.min(a.length, p + 16));
          for (const e of b) {
            let h = e
              .toString(16)
              .toUpperCase()
              .padStart(2, '0');
            /*line += ' ' + h;*/
　　　　　　　line += h;
          }
          /*let addr = p
            .toString(16)
            .toUpperCase()
            .padStart(8, '0');
          line = `${addr}:${line}\n`;*/
          s += line;
        }
        /*
        let pre = document.getElementById('pre1');
        pre.innerHTML = s;*/
        console.log(s);
        const button = document.createElement("button");
        document.body.appendChild(button);
        button.id=file.name;
        button.innerHTML = "変換したファイルをダウンロード";
　　　　　button.onclick = function(){button1_clicked();};
      })
      .catch(reason => {
        alert(reason);
      });
  });
});

function button1_clicked(){
  const blob = new Blob([s], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = document.getElementsByTagName("button")[0].id+'.txt';
  a.href = url;
  a.click();
  a.remove();
  document.getElementsByTagName("button")[0].remove();
  document.getElementById('file1').value = '';
  URL.revokeObjectURL(url);
}

