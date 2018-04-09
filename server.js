import app from './src/app';

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.info('server is listening on port', app.get('port'));
});
