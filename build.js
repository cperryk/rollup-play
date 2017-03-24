const rollup = require('rollup'),
  sourceMap = require('source-map'),
  path = require('path'),
  babel = require('rollup-plugin-babel');


rollup.rollup({
  entry: 'main.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [
        'babel-preset-es2015-rollup'
      ]
    })
  ]
})
.then((bundle)=>{
  const result = bundle.generate({
    sourceMap: true
  });

  console.log(result.code);
  // console.log(result.map);

  var consumer = new sourceMap.SourceMapConsumer(result.map);

  consumer.computeColumnSpans();
    console.log(consumer.__generatedMappings);


  console.log('-------');
  printAllFromSource(result.code, consumer, path.resolve('./main'));
  printAllFromSource(result.code, consumer, path.resolve('./c'));

});

function printAllFromSource(code, consumer, source) {
  const sourceIndex = consumer._sources.indexOf(source + '.js'),
    lines = code.split('\n');

  let s = '';
  const ms = consumer.__generatedMappings
    .filter(m => m.source === sourceIndex)
    // single-character lines will only be represented by one mapping starting at col 1, so set it to 0
    .map((m) => {
      if (m.generatedColumn === 1 && m.lastGeneratedColumn === Infinity) {
        m.generatedColumn = 0;
      }
      return m;
    })
    .forEach(m => s += lines[m.generatedLine - 1].substring(m.generatedColumn, m.lastGeneratedColumn + 1));
  console.log(s);
}
