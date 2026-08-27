// ========================================
// NAVBAR COMPONENT
// ========================================

const navbarItems = [
    {
        name: "Home",
        link: "#home"
    },
    {
        name: "About",
        link: "#about"
    },
    {
        name: "Skills",
        link: "#skills"
    },
    {
        name: "Experience",
        link: "#experience"
    },
    {
        name: "Projects",
        link: "#projects"
    },
    {
        name: "YouTube",
        link: "#youtube"
    },
    {
        name: "Achievements",
        link: "#achievements"
    },

    {
        name: "Certificates",
        link: "#certificates"
    },

    {
        name: "Contact",
        link: "#contact"
    }
];


function createNavbar() {

    const container =
        document.getElementById("navbar");

    navbarItems.forEach(item => {

        container.innerHTML += `
            <li>
                <a href="${item.link}">
                    ${item.name}
                </a>
            </li>
        `;

    });

}

createNavbar();


// ========================================
// SKILLS COMPONENT
// ========================================

const skills = [

    {
        name: "HTML & CSS",
        description: "Web Development"
    },

    {
        name: "JavaScript",
        description: "Frontend & Backend"
    },

    {
        name: "React",
        description: "Frontend Development"
    },

    {
        name: "Flutter",
        description: "Mobile Development"
    },

    {
        name: "Python",
        description: "Programming & AI"
    },

    {
        name: "Blender",
        description: "3D Modeling"
    },

    {
        name: "Editing",
        description: "Video editing, thumbnail, and content creation"
    },

    {
        name: "Microsoft Office",
        description: "Word, Excel, PowerPoint"
    },

];


function createSkills() {

    const container =
        document.getElementById("skills-container");

    skills.forEach(skill => {

        container.innerHTML += `

            <div class="skill">

                <h3>
                    ${skill.name}
                </h3>

                <p>
                    ${skill.description}
                </p>

            </div>

        `;

    });

}

createSkills();


// ========================================
// EXPERIENCE COMPONENT
// ========================================

const experiences = [

    {
        title: "Internship",

        company:
            "PT Enigma Cipta Humanika",

        year: "Juli, 2025 - September, 2025",

        description:
            "- Completed a university-required internship at Enigma Camp. <br> - Completed assigned tasks under the guidance of a mentor."
    },


    {
        title: "MEETING FOCUS (Jakarta Eye Center) | Software Quality Assurance",

        company:
            "Jakarta Eye Center",

        year: "November, 2025 - December, 2025",

        description:
            `- Performed manual functional and UI testing to verify application features. 
            <br> - Documented testing results and identified issues using Microsoft Excel.
            <br> - Used Chrome Developer Tools (Inspect) to inspect UI elements during testing.`
    },


    {
        title: "JEC WEBSITE REVAMP (Jakarta Eye Center) | Software Quality Assurance",

        company:
            "Jakarta Eye Center",

        year: "January, 2025 - March, 2025",

        description:
            `- Conducted manual testing to validate website functionality and user interface. 
            <br> - Verified feature implementation against project requirements.
            <br> - Recorded testing findings in Microsoft Excel and communicated issues to the development team.`
    }

];


function createExperiences() {

    const container =
        document.getElementById(
            "experience-container"
        );

    experiences.forEach(experience => {

        container.innerHTML += `

            <div class="timeline-item">

                <h3>
                    ${experience.title}
                </h3>

                <span>
                    ${experience.company}
                    — ${experience.year}
                </span>

                <p>
                    ${experience.description}
                </p>

            </div>

        `;

    });

}

createExperiences();


// ========================================
// PROJECT COMPONENT
// ========================================

const projects = [

    
    {
        title: "Mobile programming project untuk academic expo",

        image: "img/project/antikorupsi.png",

        description:
            `Aplikasi mobile berbasis Flutter yang berfokus pada edukasi anti korupsi dan pelaporan
            pelanggaran korupsi, dilengkapi dengan fitur login, pendaftaran, dan pengiriman laporan.
            yang digunakan untuk kompetisi Mobile Programming pada Teknokrat Academic Expo 2024.`,

        link: "",

        button: "View Code"
    },

    {
        title: "Aplikasi sinau geometry untuk academic expo",

        image: "img/project/geometry.jpeg",

        description:
            `Aplikasi augmented reality interaktif yang berfokus pada pembelajaran geometri, 
            yang bekerja dengan cara menangkap gambar yang disediakan lalu memunculkan gambar 
            object 3d dan dapat menampilkan rumus dari bangun ruang yang ditampilkan.
            digunakan untuk kompetisi AR/VR pada Teknokrat Academic Expo 2024.`,

        link: "",

        button: ""
    },

    {
        title: "Aplikasi web deteksi penyakit DBD untuk academic expo",

        image: "img/project/dbd.png",

        description:
            `Aplikasi web AI Agent berbasis Flask yang berfokus pada deteksi penyakit DBD menggunakan 
            algoritma Random Forest Classifier, yang digunakan untuk kompetisi Machine 
            Learning pada Teknokrat Academic Expo 2025.`,

        link: "",

        button: ""
    },


    {
        title: "SQA Project MEETING FOCUS (Jakarta Eye Center)",

        image: "img/project/meetingfocus.png",

        description:
            `Melakukan pengujian manual fungsional dan UI untuk memverifikasi fitur 
            aplikasi Meeting Focus, mendokumentasikan hasil pengujian, dan mengidentifikasi 
            masalah.`,

        link: "",

        button: ""
    },


    {
        title: "SQA Project JEC Web Revamp (Jakarta Eye Center)",

        image: "img/project/jecwebrevamp.png",

        description:
            `Melakukan pengujian manual untuk memvalidasi fungsionalitas dan antarmuka pengguna
            pada website JEC Web Revamp, memverifikasi implementasi fitur terhadap persyaratan proyek,
            serta mencatat temuan pengujian dan mengkomunikasikan masalah kepada tim pengembangan.`,

        link: "",

        button: ""
    },


    {
        title: "IoT Traffic Light Prototype",

        image: "img/project/trafficlight.jpg",

        description:
            `Prototype traffic light berbasis ESP32 menggunakan MQTT untuk komunikasi data dan monitoring status lampu secara real-time.`,

        link: "",

        button: ""
    },


    {
        title: "Sistem Monitoring menggunakan ESP Home",

        image: "img/project/homeassistant.jpg",

        description:
            `Membuat sistem monitoring menggunakan esp home untuk memantau status lampu lalu lintas berbasis IoT.`,

        link: "",

        button: ""
    },
    
    {
        title: "Metaverse 3D",

        image: "img/project/tmetaverse.png",

        description:
            `Lingkungan pembelajaran 3D interaktif sebagai media AI Instructor.`,

        link: "",
        button: ""
    },


];

function createProjects() {

    const container =
        document.getElementById(
            "projects-container"
        );

    projects.forEach(project => {

        const button = project.link
            ? `
                <a
                    href="${project.link}"
                    target="_blank"
                    class="btn btn-outline"
                >
                    ${project.button}
                </a>
              `
            : "";


        container.innerHTML += `

            <div class="project">

                <img
                    src="${project.image}"
                    alt="${project.title}"
                >

                <div class="project-content">

                    <h3>
                        ${project.title}
                    </h3>

                    <p>
                        ${project.description}
                    </p>

                    ${button}

                </div>

            </div>

        `;

    });

}

createProjects();


// ========================================
// YOUTUBE COMPONENT
// ========================================

const youtube = {

    channelName: "Kuradea DCA",

    handle: "@KuradeaDCA",

    subscribers: "1K+",

    views: "1M+",

    since: "2025",

    description:
        "Mengelola channel YouTube yang berfokus pada konten Minecraft, mulai dari ide konten, recording, editing, hingga publikasi.",

    link:
        "https://www.youtube.com/@KuradeaDCA"

};


function createYoutube() {

    const container =
        document.getElementById(
            "youtube-container"
        );

    container.innerHTML = `

        <div class="youtube-card">

            <div class="youtube-info">

                <div class="youtube-logo">
                    ▶
                </div>

                <div>

                    <h3>
                        ${youtube.channelName}
                    </h3>

                    <p class="youtube-handle">
                        ${youtube.handle}
                    </p>

                    <p class="youtube-description">
                        ${youtube.description}
                    </p>

                </div>

            </div>


            <div class="youtube-stats">


                <div class="youtube-stat">

                    <strong>
                        ${youtube.subscribers}
                    </strong>

                    <span>
                        Subscribers
                    </span>

                </div>


                <div class="youtube-stat">

                    <strong>
                        ${youtube.views}
                    </strong>

                    <span>
                        Total Views
                    </span>

                </div>


                <div class="youtube-stat">

                    <strong>
                        ${youtube.since}
                    </strong>

                    <span>
                        Since
                    </span>

                </div>


            </div>


            <a
                href="${youtube.link}"
                target="_blank"
                class="youtube-button"
            >
                Visit YouTube Channel →
            </a>

        </div>

    `;

}

createYoutube();


// ========================================
// ACHIEVEMENT COMPONENT
// ========================================

const achievements = [

    {
        title: "INDONESIA ROBOT CONTEST 2023 (Humanoid Robot Soccer Division)",

        description:
            `Served as a member of the Humanoid Soccer Robot Team at Universitas Teknokrat Indonesia.
            <br>Achieved 4th Place in the Regional Indonesian Robot Contest (KRI).
            <br>Qualified for the National Indonesian Robot Contest (KRI).`
    },


    {
        title:
            "1st Place – AR/VR Competition",

        description:
            "Teknokrat Academic Expo — January 2024"
    },


    {
        title:
            "1st Place – Mobile Programming Competition",

        description:
            "Teknokrat Academic Expo — June 2024"
    },


    {
        title:
            "1st Place – Machine Learning Competition",

        description:
            "Teknokrat Academic Expo — June 2025"
    },


    {
        title:
            "GEMASTIK 2025 (Game Development Division)",

        description:
            `Created and designed 2D and 3D game assets.
            <br>Collaborated with the development team to support game production.`
    }

];


function createAchievements() {

    const container =
        document.getElementById(
            "achievements-container"
        );

    achievements.forEach(achievement => {

        container.innerHTML += `

            <div class="achievement">

                <h3>
                    ${achievement.title}
                </h3>

                <p>
                    ${achievement.description}
                </p>

            </div>

        `;

    });

}

createAchievements();


// ========================================
// CERTIFICATE COMPONENT
// ========================================

const certificates = [

    {
        title: "Kontes Robot Sepak Bola Indonesia Humanoid",

        issuer: "Puspresnas",

        date: "2023",

        image: "img/sertifikat/KRSBIH.jpg",

        link: ""
    },

    {
        title: "Teknokrat Academic Expo 2024 - AR/VR Competition",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2024",

        image: "img/sertifikat/arvr.jpeg",

        link: ""
    },


    {
        title: "Teknokrat Academic Expo 2024 - Mobile Programming Competition",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2024",

        image: "img/sertifikat/mobile.jpg",

        link: ""
    },


    {
        title: "Teknokrat Academic Expo 2024 - Machine Learning Competition",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2025",

        image: "img/sertifikat/machinelearning.jpg",

        link: ""
    },


    {
        title: "Pelatihan Mikrotik",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2025",

        image: "img/sertifikat/mikrotik.jpg",

        link: ""
    },


    {
        title: "Competency Based Microsoft Office",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2025",

        image: "img/sertifikat/moffice.jpg",

        link: ""
    },


    {
        title: "Competency Based Design Grafis",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2026",

        image: "img/sertifikat/desaingrafis.jpg",

        link: ""
    },


    {
        title: "Competency Based Toubleshooting & Jaringan Komputer",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2026",

        image: "img/sertifikat/trouble&jarkom.jpg",

        link: ""
    },


    {
        title: "Teknokrat Career Preparation Program",

        issuer: "Universitas Teknokrat Indonesia",

        date: "2026",

        image: "img/sertifikat/career.jpg",

        link: ""
    }

];


function createCertificates() {

    const container =
        document.getElementById(
            "certificates-container"
        );


    certificates.forEach(certificate => {


        const button = certificate.link
            ? `
                <a
                    href="${certificate.link}"
                    target="_blank"
                    class="btn btn-outline"
                >
                    View Certificate
                </a>
              `
            : "";


        container.innerHTML += `

            <div class="certificate">

                <img
                    src="${certificate.image}"
                    alt="${certificate.title}"
                >


                <div class="certificate-content">

                    <h3>
                        ${certificate.title}
                    </h3>

                    <p>
                        ${certificate.issuer}
                    </p>

                    <span>
                        ${certificate.date}
                    </span>

                    ${button}

                </div>

            </div>

        `;

    });

}


createCertificates();


// ========================================
// SOCIAL MEDIA COMPONENT
// ========================================

const socials = [

    {
        name: "YouTube",

        link:
            "https://www.youtube.com/@KuradeaDCA"
    },


    {
        name: "Instagram",

        link:
            "https://www.instagram.com/deo.ca_"
    },


    {
        name: "LinkedIn",

        link:
            "https://www.linkedin.com/in/deo-cahyo-anggoro-4152a9336"
    },


    {
        name: "GitHub",

        link:
            "https://github.com/Deoca27"
    }

];


function createSocials() {

    const container =
        document.getElementById(
            "socials-container"
        );

    socials.forEach(social => {

        container.innerHTML += `

            <a
                href="${social.link}"
                target="_blank"
            >
                ${social.name}
            </a>

        `;

    });

}

createSocials();


// ========================================
// IMAGE POPUP / LIGHTBOX
// ========================================

const imageModal =
    document.getElementById("image-modal");

const modalImage =
    document.getElementById("modal-image");

const modalClose =
    document.getElementById("modal-close");


// OPEN IMAGE

document.addEventListener("click", function (event) {

    if (
        event.target.matches(
            ".project img, .certificate img"
        )
    ) {

        modalImage.src =
            event.target.src;

        modalImage.alt =
            event.target.alt;

        imageModal.classList.add("active");

        document.body.style.overflow = "hidden";

    }

});


// CLOSE WITH X

modalClose.addEventListener(
    "click",
    function () {

        closeImageModal();

    }
);


// CLOSE WHEN CLICKING OUTSIDE IMAGE

imageModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === imageModal
        ) {

            closeImageModal();

        }

    }
);


// CLOSE WITH ESC

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeImageModal();

        }

    }
);


// CLOSE FUNCTION

function closeImageModal() {

    imageModal.classList.remove(
        "active"
    );

    modalImage.src = "";

    document.body.style.overflow = "";

}


// ========================================
// HAMBURGER MENU
// ========================================

const hamburger =
    document.getElementById("hamburger");

const navbar =
    document.getElementById("navbar");


hamburger.addEventListener("click", () => {

    hamburger.classList.toggle("active");

    navbar.classList.toggle("active");

});


navbar.addEventListener("click", (event) => {

    if (event.target.tagName === "A") {

        hamburger.classList.remove("active");

        navbar.classList.remove("active");

    }

});


document.addEventListener("click", (event) => {

    if (
        !hamburger.contains(event.target) &&
        !navbar.contains(event.target)
    ) {

        hamburger.classList.remove("active");

        navbar.classList.remove("active");

    }

});