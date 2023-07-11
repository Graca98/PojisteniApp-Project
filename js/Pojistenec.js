//!! Úkolníček
//todo      1. Při smazání se celý řádek TR změní na červenou (Danger)
//*         2. Při kliknutí na Edit tlačítko se přidá TD s tlačítky na smazání
//*         3. Alerty se vytvaří pod sebe (vymyslet jak udelat jen jeden)
//?         4. Po odeslání formuláře se obsah inputu smaže (stačí odkomentovat)
//todo      5. Přidat paginace k tabulkám (stránky 1,2,3...)
//todo

class Pojistenec {

    constructor() {
        const pojistenciZeStorage = localStorage.getItem("uzivatele")
        this.pojistenci = pojistenciZeStorage ? JSON.parse(pojistenciZeStorage) : []
        this.isValid = true // Pro validace forms

        this.jmeno = document.getElementById("firstName");
        this.prijmeni = document.getElementById("lastName");
        this.vek = document.getElementById("age");
        this.telCislo = document.getElementById("phoneNumber");
        this.odeslatBtn = document.getElementById("odeslatBtn");
        this.editBtn = document.getElementById("editBtn");

        this.pridejUzivatele()
    }

    pridejUzivatele() {
        this.odeslatBtn.onclick = (e) => {
            e.preventDefault()

            // Validace inputů
            this.zvalidujForm()

            // Vytvoření uživatele z value formu a uložení do array a localstorage
            if (this.isValid) {

                // Přidá mezery mezi tel číslo
                let number = this.telCislo.value
                let phoneNumber = [number.slice(0, 3), " ", number.slice(3, 6), " ", number.slice(6, 9), " "].join("")

                // Uloží uživatele podle údaju zadaných do forms
                const uzivatel = new Uzivatel(this.jmeno.value, this.prijmeni.value, this.vek.value, phoneNumber)
                this.pojistenci.push(uzivatel)

                this.ulozPojistence()
                this.vypisPojistenceDoTabulky()
            }

            //* Smazání inputu po odeslání
            // this.jmeno.value = ""
            // this.prijmeni.value = ""
            // this.vek.value = ""
            // this.phoneNumber.value = ""
        }

    }

    vypisPojistenceDoTabulky() {
        let tableBody = document.querySelector("#tabulka")

        // Smaže předchozí záznamy z tabulek
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        for (const pojistenec of this.pojistenci) {
            let novyRadek = document.createElement("tr");
            const vytvorTd = document.createElement("td");
            // Vytvoří div na button groupy
            const btnDiv = document.createElement("div")
            btnDiv.classList = "btn-group"
            btnDiv.id = "btnGroupDiv"
            btnDiv.role = "group"
            btnDiv.ariaLabel = "Basic mixed styles example"

            novyRadek.appendChild(this.vytvorBunku(pojistenec.name));
            novyRadek.appendChild(this.vytvorBunku(pojistenec.phoneNumber));
            novyRadek.appendChild(this.vytvorBunku(pojistenec.age));

            this._pridejTlacitkoDoTable("Smazat", () => {
                // Vyplní obsah modal popu a nastaví callback hlavního tlačítka
                this._modalPop(
                    "Potvrzení",
                    "Opravdu si přejete smazat uživatele?",
                    "Zrušit",
                    "Smazat",
                    "btn btn-danger",
                    () => {
                        this.pojistenci = this.pojistenci.filter(z => z !== pojistenec); // Ponechá vše co není rovné proměnné pojistenec
                        this.ulozPojistence();
                        this.vypisPojistenceDoTabulky();
                        modal.hide();
                        this.vytvorAlert(
                            "alert alert-success",
                            "Uživatel byl smazán"
                        )
                    }
                )
                // Zobrazí modal popup
                const modal = new bootstrap.Modal(document.getElementById('modal-pop'));
                modal.show();
            }, "btn btn-danger btn-sm", btnDiv);


            this._pridejTlacitkoDoTable("Edit", () => {
                this.editujBunku(novyRadek)
            }, "btn btn-warning btn-sm px-3", btnDiv);

            tableBody.appendChild(novyRadek)
            novyRadek.appendChild(vytvorTd)
            vytvorTd.appendChild(btnDiv)
        }

    }

    _pridejTlacitkoDoTable(titulek, callback, btnClassList, element) {
        const button = document.createElement("button");
        button.onclick = callback;
        button.innerText = titulek;
        button.classList = btnClassList

        element.appendChild(button)
    }

    _modalPop(title, text, btnCancelText, btnSaveText, btnSaveType, btnSaveCallback) {
        const modalTitle = document.getElementById("modal-pop-title")
        const modalText = document.getElementById("modal-pop-text")
        const modalBtnCancel = document.getElementById("modal-pop-btn-cancel")
        const modalBtnSave = document.getElementById("modal-pop-btn-save")

        modalTitle.textContent = title
        modalText.textContent = text
        modalBtnCancel.textContent = btnCancelText
        modalBtnSave.textContent = btnSaveText
        modalBtnSave.classList = btnSaveType
        modalBtnSave.onclick = btnSaveCallback
    }

    vytvorBunku(text) {
        let td = document.createElement("td");
        let tdInput = document.createElement("input");

        tdInput.type = "text";
        tdInput.value = text
        tdInput.readOnly = true
        tdInput.classList = "form-control-plaintext"

        td.appendChild(tdInput)
        return td
    }

    editujBunku(radek) {
        const bunky = radek.getElementsByTagName("td");
        const pojistenec = this.pojistenci[radek.rowIndex - 1]

        //? Pokud se přídá více td (bunek) je potreba je tu označit číslem
        //todo Pokusit se přijít na lepší způsob
        for (let i = 0; i < bunky.length - 1; i++) { // Zvolí všechny td v TR krom posledího
            const td = bunky[i];
            const input = td.querySelector("input");
            const inputName = bunky[0].querySelector("input")
            const inputPhoneNumber = bunky[1].querySelector("input")
            const inputAge = bunky[2].querySelector("input")

            input.readOnly = false;
            input.classList.remove("form-control-plaintext");
            
            inputName.oninput = (e) => {
                pojistenec[`${'name'}`] = "";
                pojistenec[`${'name'}`] = e.target.value
            }
            inputPhoneNumber.oninput = (e) => {
                pojistenec[`${'phoneNumber'}`] = "";
                pojistenec[`${'phoneNumber'}`] = e.target.value
            }
            inputAge.oninput = (e) => {
                pojistenec[`${'age'}`] = "";
                pojistenec[`${'age'}`] = e.target.value
            }
        }

        //? Pokud přidám více td, je potřeba upravit toto číslo
        const btnDiv = bunky[3].getElementsByTagName("div")[0]
        btnDiv.innerHTML = ""
        this._pridejTlacitkoDoTable("Zrušit", () => {
            this.vypisPojistenceDoTabulky()
        }, "btn btn-danger btn-sm", btnDiv)

        this._pridejTlacitkoDoTable("Uložit", () => {
            this.ulozPojistence();
            this.vypisPojistenceDoTabulky();
        }, "btn btn-success btn-sm", btnDiv)

    }

    ulozPojistence() {
        localStorage.setItem("uzivatele", JSON.stringify(this.pojistenci));
    }

    zvalidujForm() {
        this.isValid = true

        // Validace jména
        if (this.jmeno.value.trim().length <= 3 || this.jmeno.value.trim().length >= 12) {
            this.vytvorInvalidAlert("Přílíš krátké/dlouhé jméno!", "firstName", "invalid-jmeno")
            this.isValid = false
        } else {
            let rmvInvalid = document.getElementById("firstName")
            rmvInvalid.classList.remove("is-invalid")
            rmvInvalid.classList.add("is-valid")
        }

        // Validace přijmení
        if (this.prijmeni.value.trim().length <= 3 || this.prijmeni.value.trim().length >= 12) {
            this.vytvorInvalidAlert("Přílíš krátké/dlouhé přijmení!", "lastName", "invalid-prijmeni")
            this.isValid = false
        } else {
            let rmvInvalid = document.getElementById("lastName")
            rmvInvalid.classList.remove("is-invalid")
            rmvInvalid.classList.add("is-valid")
        }

        // Validace věku
        if (this.vek.value.trim() < 1 || this.vek.value.trim() > 120) {
            this.vytvorInvalidAlert("Zadejte svůj skutečný věk!", "age", "invalid-age")
            this.isValid = false
        } else {
            let rmvInvalid = document.getElementById("age")
            rmvInvalid.classList.remove("is-invalid")
            rmvInvalid.classList.add("is-valid")
        }

        // Validace tel čísla
        if (this.telCislo.value.trim().length <= 8 || this.telCislo.value.trim().length >= 10) {
            this.vytvorInvalidAlert("Zadejte platné telefonní číslo!", "phoneNumber", "invalid-phoneNumber")
            this.isValid = false
        } else {
            let rmvInvalid = document.getElementById("phoneNumber")
            rmvInvalid.classList.remove("is-invalid")
            rmvInvalid.classList.add("is-valid")
        }

        // Vrácení stavu validace
        return this.isValid;

    }

    // Funkce pro vytvoření červených invalid textů u inputů
    vytvorInvalidAlert(text, inputId, invalidDivId) {
        let pridejInvalid = document.getElementById(inputId)
        pridejInvalid.classList.add("is-invalid")

        let div = document.getElementById(invalidDivId)
        div.textContent = text
    }

    vytvorAlert(classList, text) {
        const div = document.createElement("div");
        const alertBox = document.getElementById("alertBox")
        div.classList = classList   // alert + alert-primary/danger/atd..
        div.role = "alert"
        div.textContent = text

        // Volá se progressbar
        this.progressBar(div)

        alertBox.appendChild(div)
    }

    progressBar(element) {
        let divProgBar = document.createElement("div")
        let divProggMain = document.createElement("div")


        divProgBar.classList = "progress"
        divProgBar.role = "progressbar"
        divProgBar.ariaLabel = "Time bar"
        divProgBar.ariaValueNow = "100"
        divProgBar.ariaValueMin = "0"
        divProgBar.ariaValueMax = "100"
        divProgBar.style = "height: 5px;"
        
        divProggMain.id = "progBar"
        divProggMain.classList = "progress-bar bg-success"
        divProggMain.style = "width: 100%"
        
        let currentChunk = 0
        let chunks = 5
        
        let timer = setInterval(update, 10)
        
        function update() {
            currentChunk += 0.01
            let progPercent = 100 - (currentChunk * (100 / chunks))
            divProggMain.style = ("width:" + progPercent + "%")
            divProgBar.ariaValueNow = progPercent
            
            if (progPercent <= 0) {
                clearInterval(timer)
                alertBox.innerHTML = ""              
            }
            console.log(currentChunk)
        }
        
        divProgBar.appendChild(divProggMain)
        element.appendChild(divProgBar)
    }

}