
        document.getElementById('send-button').addEventListener('click', function() {
            enviarMensagem();
        });

        document.getElementById('entrada_texto').addEventListener('keyup', function(event) {
            if (event.keyCode === 13) {
                enviarMensagem();
            }
        });

        function enviarMensagem() {
            var mensagem = document.getElementById("entrada_texto").value;
            if (mensagem.trim() !== '') {
                enviarRequisicaoRasa(mensagem);
            }
        }

        function exibirResposta(resposta) {
            var userInput = document.getElementById("entrada_texto").value;
            var chatMessages = document.getElementById('chat');

            var userMessageElement = createMessageElement(userInput, 'message left', 'avatar.png');
            chatMessages.appendChild(userMessageElement);

            var botMessageElement = createMessageElement(resposta, 'message right', 'chatbot.png');
            chatMessages.appendChild(botMessageElement);

            document.getElementById('entrada_texto').value = '';
        }

        function createMessageElement(message, className, icon) {

            var messageContainer = document.createElement('li');
            messageContainer.className = className;

            var imageUrl = icon;
            var imageElement = document.createElement('img');
            imageElement.src = "https://cientistaspatentes.com.br/imagens/" + imageUrl;
            imageElement.width = 60;
            imageElement.align = 'middle';
            imageElement.className = 'logo';
            messageContainer.appendChild(imageElement);

            if (message.trim() !== '') {
                var textElement = document.createElement('p');
                textElement.innerText = "  " + message;
                messageContainer.appendChild(textElement);
            }

            return messageContainer;

        }

        function enviarRequisicaoRasa(mensagem) {
            var url = "http://localhost:5005/webhooks/rest/webhook";
            var payload = {
                "sender": "user",
                "message": mensagem
            };
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var respostas = JSON.parse(xhr.responseText);
                    if (respostas.length > 0) {
                        var resposta = respostas[0].text;
                        exibirResposta(resposta);
                    }
                }
            };
            xhr.send(JSON.stringify(payload));
        }
    