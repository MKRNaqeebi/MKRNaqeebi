<template>
    <Header />
    <Hero />
    <Statistics />
    <Projects />
    <Testimonials />
    <Blogs />
    <Contact />
    <Footer />
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Hero from '../components/Hero.vue';
import Statistics from '../components/Statistics.vue';
import Blogs from '../components/Blogs.vue';
import Projects from '../components/Projects.vue';
import Contact from '../components/Contact.vue';
import Testimonials from '../components/Testimonials.vue';

export default {
    name: 'HomeView',
    components: {
        Header,
        Footer,
        Hero,
        Statistics,
        Blogs,
        Projects,
        Contact,
        Testimonials,
    },
};
</script>
