let fr = new FileReader();
fr.onload = (e) => {
  console.log(fr.result);
}
fr.readAsText();
