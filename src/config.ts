import nconf from "nconf";

const showError = (error: unknown) => `
${error}

Pour afficher l'aide lancez l'application avec '--usage'

`;

const usage = `
Options:
  --usage    Affiche l'aide                                                    [booléen]
  --version  Affiche le numéro de version                                      [booléen]
  --path     Répertoire qui contient les fichiers à analyser                   [chaîne de caractère]
  --lang1    Langue que l'on souhaite par défaut              (defaut: 'eng')  [chaîne de caractère]
  --lang2    Langue avec laquelle échanger la position        (defaut: 'fre')  [chaîne de caractère]
`;

try {
  nconf
    .use('memory')
    .argv()
    .defaults({
      path: '//MYCLOUDEX2ULTRA/Public/Shared Videos/TODO',
      lang1: 'eng',
      lang2: 'fre'
    });
  if (nconf.get("usage")) {
    console.log(usage);
    process.exit();
  }

  nconf.required(['path', 'lang1', 'lang2']);
} catch (error) {
  console.error(showError(error));
  process.exit();
}

export const cfg: nconf.Provider = nconf;
