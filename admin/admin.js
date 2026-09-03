const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        loginMessage.textContent = "";


        try {

            const response =
                await fetch(
                    "/api/admin/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );


            const result =
                await response.json();


            if (
                response.ok &&
                result.success
            ) {

                loginMessage.style.color =
                    "#16a34a";

                loginMessage.textContent =
                    "تم تسجيل الدخول بنجاح ✅";


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    500
                );

            } else {

                loginMessage.style.color =
                    "#dc2626";

                loginMessage.textContent =
                    result.message ||
                    "اسم المستخدم أو كلمة المرور غير صحيحة";

            }

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            loginMessage.style.color =
                "#dc2626";

            loginMessage.textContent =
                "تعذر الاتصال بالخادم";

        }

    }
);