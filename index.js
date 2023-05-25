
const http = require('http')
const fs = require('fs')
const querystring = require('querystring')

var databse = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'))



////////////// OBS CRIAR FUNÇÃO DE REMOVER USUÁRIO ////////////////////

//Funções
function cadastrar(usuario){
   
   //Verificar se email já existe no "banco de dados"

   const dadosRecebidos = JSON.parse(usuario)

   console.log(dadosRecebidos.email) //mostra apenas o email no console


  

   const lista = JSON.parse(listarUsuarios())

   console.log(typeof(lista)) //object

   const emailInvalido = lista.filter(emailExistente => (emailExistente.email == dadosRecebidos.email))

   console.log(emailInvalido)

   //Verifica se e-mail já existe no arquivo json
   if(emailInvalido.length == 1) {


        return `Este e-mail já existe, tente novamente.`
   }

   //Caso o e-mail ainda não exista no json
    else{

    try {
        

        databse.usuarios.push(JSON.parse(usuario))
        fs.writeFileSync('usuarios.json', JSON.stringify(databse))
        return 'Usuário cadastrado com sucesso!'


       
   } catch (error) {
       return 'erro ao cadastrar usuário'
   }

    }
  

}

function listarUsuarios(){

    try {

        return JSON.stringify(databse.usuarios)
        
    } catch (error) {
        return 'Erro ao listar usuários: ' + error 
    }
}


//servidor
const servidor = http.createServer((request, response) => {


if(request.url == '/usuarios'){

switch(request.method) {

    case 'POST':
        let dados = ''

        request.on('data', (data) => {
            dados += data

          
                request.on('end', () => {
                    response.writeHead(200, {'Content-Type': 'text/plain; charset: utf-8'})
                    response.end(cadastrar(dados))
                })
            


        })

       
    
        break
        case 'GET':
            response.writeHead(200, {'Content-Type': 'application/json; charset: utf-8'})
            response.end(listarUsuarios())
            break
            case 'PUT':
                console.log('editar')
                break
                case   'DELETE':
                    console.log('deletar')
                    break

                    default:
                        console.log('Utilize outro método http')
                        break
}



} else{

    response.writeHead(200, {'Content-Type': 'text/plain; charset: utf-8'})
    response.end('Acesse /usuarios')
}



})

servidor.listen(3000)






