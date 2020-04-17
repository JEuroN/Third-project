Tinder

El algoritmo se encuentra en el service notifi
El match funciona utilizando los parametros que el usuario selecciona en el view notification, se guardan en firebase y se consultan cada vez que se buscara un nuevo match, si no existen,
no busca. Si encuentra parametros el busca en todos los usuarios aquellos que cumplan con los parametros y verifica si ya se habia encontrado antes a ese usuario, una vez que se le da like o no, el guarda el id en una coleccion asi no puede volver a aparecer.
Posteriormente se agregara que al darle like a un usuario. si los dos usuarios se dieron like mutuamente se cree una sala de chat entre ambos.