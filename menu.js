(function(){
    const burger = document.getElementById('burger');
    const drawer = document.getElementById('drawer');
    if (!burger || !drawer) return;
  
    function setOpen(open){
      drawer.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  
    burger.addEventListener('click', () => {
      setOpen(!drawer.classList.contains('open'));
    });
  
    document.addEventListener('click', (e) => {
      if (!drawer.classList.contains('open')) return;
      if (drawer.contains(e.target) || burger.contains(e.target)) return;
      setOpen(false);
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  })();