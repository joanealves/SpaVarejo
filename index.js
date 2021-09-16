let alltransaction = localStorage.getItem("transactions")
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

let error = false

document.querySelector("#mercadoriaName")
.addEventListener('keydown', (event) => {
event.key
?  document.querySelector("#requiredMercadoria").innerHTML = ''
: ''

error = false
});

document.querySelector('#mercadoriaValor')
.addEventListener('keydown', (event)  => {
    event.key ?  document.querySelector('#requiredValue').innerHTML = '' : ''

    error= false
});

document.querySelector("#addTransaction").addEventListener("click", (e) => {
    let transactionType = document.querySelector("#transactionType").value;
    let mercadoriaName = document.querySelector("#mercadoriaName").value;
    let mercadoriaValor = $("#mercadoriaValor").maskMoney('unmasked')[0];

    let required = `<p class="required" >Campo Obrigatório</p>`;
    console.log(mercadoriaName)
    
 
    if (mercadoriaName === "") {
        document.querySelector("#requiredMercadoria").innerHTML = required;
        error = true
    }

    if (mercadoriaValor === 0) {
        document.querySelector("#requiredValue").innerHTML = required;
        error = true
    }

    if (!error) {
        alltransaction.push({
            transactionType: transactionType === "venda" ? "+" : "-",
            mercadoriaName: mercadoriaName,
            mercadoriaValor: transactionType === 'venda' ? mercadoriaValor : mercadoriaValor * -1,
        });
        localStorage.setItem("transactions", JSON.stringify(alltransaction));

        renderTable();
    }
});


const renderTable = () => {
    let tableContent = `
      <tr>
          <th></th>
          <th class="bold">Mercadoria</th>
          <th class="bold coldr">Valor</th>
       </tr>
       <tr>
          <td class="borda" colspan="3"></td>
       </tr>
   `;

    let totalPrice = 0

    alltransaction.forEach((item) => {
        tableContent =
            tableContent +
            ` 
       <tr>
          <td>${item.transactionType}</td>
          <td>${item.mercadoriaName}</td>
          <td>R$ ${item.mercadoriaValor.toFixed(2).toString().replace('.', ',').replace('-', '')}</td>
       </tr>
       <tr>
         <td colspan="3" class="borda"></td>
       </tr>
     `;
        totalPrice += item.mercadoriaValor
    })

    document.querySelector("#table").innerHTML = tableContent;
    document.querySelector('#totalPrice').innerHTML = `R$ ${totalPrice.toFixed(2).toString().replace('.', ',')}`

    let lucro = totalPrice > 0 ? 'LUCRO' :
        totalPrice < 0 ? 'PREJUÍZO' :
            "Nenhuma transação cadastrada."


    document.querySelector('#hasProfit').innerHTML = lucro

};

renderTable();

const handleClear = () => {
    let limpar = `
        <button id="yesClear" value="yes" onclick="clearData(value)" type="button"> Excluir dados?</button>
        <button id="noClear"  value="no" onclick="clearData(value)" type="button">Não excluir</button>
    `
    document.querySelector("#clear").innerHTML = limpar;
}

const clearData = (value) => {

    if (value === "yes") {
        alltransaction = [];
        localStorage.setItem("transactions", JSON.stringify(alltransaction));
        renderTable();
        document.querySelector("#clear").innerHTML = "";
    } else {
        document.querySelector("#clear").innerHTML = "";
    }

}


//Máscara
$(document).ready(() => {
    $("#mercadoriaValor").maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: ".",
    });
});

const saveServer = () => {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer key2CwkHb0CKumjuM");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "records": [
            {
                "id": "recz2ASo1TnTkWmk7",
                "fields": {
                    "Aluno": "7608",
                    "Json": JSON.stringify(alltransaction)
                }
            }
        ]
    });

    var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            alert("Dados atualizados com sucesso!")
        })
        .catch(error => {
            console.log('error', error)
            alert("Erro ao salvar os dados.")
        });
}
