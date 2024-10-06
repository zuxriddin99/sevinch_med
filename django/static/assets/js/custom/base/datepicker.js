document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#date_of_birth", {
        maxDate: "today", // Customize month names (in Uzbek or any other language)
        locale: {
            firstDayOfWeek: 1,  // Set Monday as the first day of the week
            months: {
                shorthand: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
                longhand: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"]
            }, weekdays: {
                shorthand: ["Yak", "Du", "Se", "Chor", "Pay", "Ju", "Sha",],  // Uzbek short weekday names
                longhand: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba",]
            }
        },

        // Format for displaying the date
        dateFormat: "d/m/Y"  // Day/Month/Year format
    });
});
