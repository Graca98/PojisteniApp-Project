
class Pojistenec {

    constructor() {
        const pojistenciZeStorage = localStorage.getItem("uzivatele")
        this.pojistenci = pojistenciZeStorage ? JSON.parse(pojistenciZeStorage) : []

        this.jmeno = document.getElementById("firstName");
        this.prijmeni = document.getElementById("lastName");
        this.vek = document.getElementById("age");
        this.telCislo = document.getElementById("phoneNumber");
        this.odeslatBtn = document.getElementById("odeslatBtn");
        this.editBtn = document.getElementById("editBtn");
        this.openFormBtn = document.getElementById("openFormBtn")
        this.formContainer = document.getElementById("mainFormDiv")
        this.btnSearch = document.getElementById("btnSearch")


        this.pridejUzivatele()
        this.openForm()
    }

    // Způsobí, že se strának přesune nahoru
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    pridejUzivatele() {
        this.odeslatBtn.onclick = (e) => {
            e.preventDefault()

            // Vytvoření uživatele z value formu a uložení do array a localstorage
            if (this.formValidation(
                this.jmeno,
                this.prijmeni,
                this.telCislo,
                this.vek
            )) {

                // Přidá mezery mezi tel číslo
                let number = this.telCislo.value
                let phoneNumber = [number.slice(0, 3), " ", number.slice(3, 6), " ", number.slice(6, 9), " "].join("")

                // Uloží uživatele podle údaju zadaných do forms
                const uzivatel = new Uzivatel(this.jmeno.value, this.prijmeni.value, this.vek.value, phoneNumber)
                this.pojistenci.push(uzivatel)

                this.ulozPojistence()
                this.vypisPojistenceDoTabulky()
                this.scrollToTop()
                this.vytvorAlert(
                    "alert alert-success",
                    "Pojišteněc byl uložen"
                )

                // Smazání inputu po odeslání
                this.jmeno.value = ""
                this.prijmeni.value = ""
                this.vek.value = ""
                this.telCislo.value = ""

                // Schová container formuláře
                this.formContainer.classList.add("d-none")
                // A přidá zpět zlatíčko "Nový pojištěnec"
                this.openFormBtn.classList.remove("d-none")
            }

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
            const btnWrapper = document.createElement("div")
            btnWrapper.classList = "d-flex justify-content-center"
            // Vytvoří div na button groupy
            const btnDiv = document.createElement("div")
            btnDiv.classList = "btn-group"
            btnDiv.id = "btnGroupDiv"
            btnDiv.role = "group"
            btnDiv.ariaLabel = "Basic mixed styles example"

            novyRadek.appendChild(this.vytvorBunku(`${pojistenec.firstName} ${pojistenec.lastName}`));
            novyRadek.appendChild(this.vytvorBunku(pojistenec.phoneNumber));
            novyRadek.appendChild(this.vytvorBunku(pojistenec.age));

            this._pridejTlacitkoDoTable("Smazat", () => {
                novyRadek.classList.add("table-danger")
                // Vyplní obsah modal popu a nastaví callback hlavního tlačítka
                this._modalPop(
                    "Potvrzení",
                    "Opravdu si přejete smazat tohoto pojištěnce?",
                    "Zrušit",
                    "Smazat",
                    "btn btn-danger",
                    () => {
                        this.pojistenci = this.pojistenci.filter(z => z !== pojistenec); // Ponechá vše co není rovné proměnné pojistenec
                        this.ulozPojistence();
                        this.vypisPojistenceDoTabulky();
                        modal.hide();
                        this.scrollToTop()
                        this.vytvorAlert(
                            "alert alert-success",
                            "Pojištěnec byl smazán"
                        )
                    },
                    () => {
                        novyRadek.classList.remove("table-danger")
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
            btnWrapper.appendChild(btnDiv)
            vytvorTd.appendChild(btnWrapper)
        }

    }

    _pridejTlacitkoDoTable(titulek, callback, btnClassList, element) {
        const button = document.createElement("button");
        button.onclick = callback;
        button.innerText = titulek;
        button.classList = btnClassList

        element.appendChild(button)
    }

    _modalPop(title, text, btnCancelText, btnSaveText, btnSaveType, btnSaveCallback, btnCancelCallback) {
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
        modalBtnCancel.onclick = btnCancelCallback
    }

    vytvorBunku(text) {
        let td = document.createElement("td");
        td.textContent = text

        return td
    }

    editujBunku(radek) {
        let editJmeno = document.getElementById("editFirstName")
        let editPrijmeni = document.getElementById("editLastName")
        let editTelCislo = document.getElementById("editPhoneNumber")
        let editVek = document.getElementById("editAge")

        // const bunky = radek.getElementsByTagName("td");
        const pojistenec = this.pojistenci[radek.rowIndex - 1];

        // Retrieve the values from the selected row
        const firstName = pojistenec.firstName;
        const lastName = pojistenec.lastName;
        const phoneNumber = pojistenec.phoneNumber.replace(/\s/g, '');
        const age = pojistenec.age;

        // Display the values in the edit form
        editJmeno.value = firstName;
        editPrijmeni.value = lastName;
        editTelCislo.value = phoneNumber;
        editVek.value = age;

        // Show the edit form
        const modal = new bootstrap.Modal(document.getElementById('modal-editForm'));
        modal.show();

        // Handle the save button click
        const btnSave = document.getElementById("modal-editForm-btn-save");
        btnSave.onclick = () => {

            // Validation
            if (this.formValidation(
                editJmeno,
                editPrijmeni,
                editTelCislo,
                editVek
            )) {
                // Přidá mezery mezi čísla
                let number = editTelCislo.value
                let phoneNumber = [number.slice(0, 3), " ", number.slice(3, 6), " ", number.slice(6, 9), " "].join("")

                // Update the values in the pojistenec object
                pojistenec.firstName = editJmeno.value;
                pojistenec.lastName = editPrijmeni.value;
                pojistenec.phoneNumber = phoneNumber;
                pojistenec.age = editVek.value;

                this.ulozPojistence();
                this.vypisPojistenceDoTabulky();

                // Hide the edit form
                modal.hide();
            }
        };
    }

    ulozPojistence() {
        localStorage.setItem("uzivatele", JSON.stringify(this.pojistenci));
    }

    // ====== Validation ======
    validationOfName(idInput) {
        const regName = /^[a-zA-Z\u00C0-\u017F'´`]{2,16}$/;
        if (!regName.test(idInput.value)) {
            this.vytvorInvalidAlert("Přílíš krátké/dlouhé jméno!", idInput, "invalid-jmeno");
            return false;
        } else {
            idInput.classList.remove("is-invalid");
            idInput.classList.add("is-valid");
            return true;
        }
    }

    validationOfPhoneNumber(idInput) {
        const regPhoneNumber = /^\d{9}$/;
        if (!regPhoneNumber.test(idInput.value)) {
            this.vytvorInvalidAlert("Zadejte platné telefonní číslo!", idInput, "invalid-phoneNumber");
            return false;
        } else {
            idInput.classList.remove("is-invalid");
            idInput.classList.add("is-valid");
            return true;
        }
    }

    validationOfAge(idInput) {
        const regAge = /^(?:[1-9][0-9]?|1[01][0-9]|130)$/;
        if (!regAge.test(idInput.value)) {
            this.vytvorInvalidAlert("Zadejte svůj skutečný věk!", idInput, "invalid-age");
            return false;
        } else {
            idInput.classList.remove("is-invalid");
            idInput.classList.add("is-valid");
            return true;
        }
    }

    formValidation(name, lastName, phoneNumber, age) {
        const isValidName = this.validationOfName(name);
        const isValidLastName = this.validationOfName(lastName);
        const isValidPhoneNumber = this.validationOfPhoneNumber(phoneNumber);
        const isValidAge = this.validationOfAge(age);

        return isValidName && isValidLastName && isValidPhoneNumber && isValidAge;
    }

    // Funkce pro vytvoření červených invalid textů u inputů
    vytvorInvalidAlert(text, inputId, invalidDivId) {
        inputId.classList.add("is-invalid")

        let div = document.getElementById(invalidDivId)
        div.textContent = text
    }

    vytvorAlert(classList, text) {
        const div = document.createElement("div");
        const alertBox = document.getElementById("alertBox")
        if (alertBox !== "") {
            alertBox.innerHTML = ""
        }
        div.classList = classList   // alert + alert-primary/danger/atd..
        div.role = "alert"
        div.textContent = text

        // Create a div for progress bar animation
        const progress = document.createElement("div");
        progress.classList = "progress";
        const progressValue = document.createElement("div");
        progressValue.classList = "progress-value";
        progress.appendChild(progressValue);
        div.appendChild(progress);

        alertBox.appendChild(div);

        // Když progress bar dojede na konec, smaže se
        progressValue.addEventListener('animationend', () => {
            const computedStyle = getComputedStyle(progressValue);
            const width = computedStyle.getPropertyValue('width');

            if (width === '0px') {
                alertBox.innerHTML = ""
            }
        });

    }

    openForm() {
        this.openFormBtn.onclick = () => {
            // Odstraní display none z containeru formuláře
            this.formContainer.classList.remove("d-none")
            // A zároveň schová btn novýho pojištence
            this.openFormBtn.classList.add("d-none")
        }
    }

}