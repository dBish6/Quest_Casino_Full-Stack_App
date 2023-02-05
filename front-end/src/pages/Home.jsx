// *Design Imports*
import {
  Container,
  VStack,
  Stack,
  Box,
  chakra,
  Text,
  Image,
} from "@chakra-ui/react";

// *Custom Hooks Import*
import useDocumentTitle from "../hooks/useDocumentTitle";

// *Component Imports*
// import TabNav from "../components/sideBar";

const Home = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <>
      <Text>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
        architecto quis dignissimos eum porro consequuntur maxime velit,
        repellendus voluptatibus saepe odit nobis, iure eius accusamus magni
        dicta veritatis placeat expedita. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Quis quo vero qui eveniet quod, nam possimus
        exercitationem, vitae officiis fuga aliquid magni minima harum expedita
        repellendus nostrum odio, sapiente reprehenderit! Lorem ipsum dolor sit
        amet consectetur adipisicing elit. Quos consectetur ratione vel ut!
        Adipisci nobis ab quas incidunt dolor perferendis id nostrum ratione
        nemo, quae sit iste obcaecati necessitatibus quis? Lorem, ipsum dolor
        sit amet consectetur adipisicing elit. Porro deleniti modi officiis
        nihil beatae hic nemo laudantium omnis quidem saepe. Reiciendis labore
        minus facilis, minima quia deserunt veniam quaerat odit. Lorem ipsum
        dolor sit amet consectetur adipisicing elit. Aperiam totam explicabo hic
        reprehenderit ea, iste autem sapiente sed reiciendis quasi, deserunt
        omnis, nobis dolorum! Deleniti cupiditate voluptatibus temporibus quos
        aspernatur?
      </Text>
    </>
  );
};

export default Home;
