export  function loadingSpinner(loading: boolean): boolean {

    const body = document.querySelector('.main');
    if (loading) {

      body?.classList.remove('loading');
        return  false;
    } else {

      body?.classList.add('loading');
      return true;

    }
  }

export const recursosUnidades = ['kilogramo', 'gramo','tonelada', 'litro', 'metro', 'metro cuadrado', 'metro cubico']



