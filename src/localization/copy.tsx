export type ContactFormErrors = {
  thisFieldIsMandatory: string;
  invalidEmail: string;
  thisFieldIsTooLong: string;
};

export type LocalizedCopy = {
  home: {
    meta: {
      description: string;
    };
    hero: {
      subtitle: string;
      name: string;
    };
    about: {
      clients: string;
      someAttendedClients: string;
      somePieces: string;
      expositionFirst: string;
      selectedWork: string;
    };
    callToAction: {
      howCanIHelpYou: string;
      getInTouch: string;
    };
    contactForm: {
      firstName: string;
      lastName: string;
      email: string;
      subject: string;
      content: string;
      send: string;
      submitSuccessful: string;
      errors: ContactFormErrors;
    };
  };
};

export const en: LocalizedCopy = {
  home: {
    meta: {
      description: `Marcelo Firpo's Portfolio, a CMO, Creative Director, Creative Consultant, Copywriter, and Screenwriter. I have more than 30 years of experience in communication, advertising, and branding. I've been awarded at multiple festivals. Get in touch now.`,
    },
    hero: {
      name: `Marcelo Firpo`,
      subtitle: `CMO, Creative Director, Creative Consultant, Copywriter, Screenwriter, Songwriter`,
    },
    about: {
expositionFirst: `Big brands need to translate complex contexts into simple yet powerful concepts.

And that's exactly what I enjoy most.

With an extensive background in creative direction and branding, awarded at multiple festivals and tested across diverse industries, I've learned to transform what is dense and difficult into clear, efficient campaigns and concepts that move people and deliver results for brands.

This ability took me beyond creation. I had a long experience at a global data and AI solutions startup, where I was responsible for marketing and growth strategies across markets in the United States, Europe, and Latin America.

Today I work from Lisbon on creative strategy, branding, content, and advertising projects.

Does your brand need more clarity? I can help.`,
      someAttendedClients: `Some customers served:`,
      somePieces: `Some pieces:`,
      clients: `Telefónica Group, Petrobras, Vivo, Braskem Group, Edenred, Aegea Group, Banrisul, Gerdau Group, Midea-Carrier,
                Springer, GRU Airport, Husqvarna, Massey Ferguson, John Deere, RBS Group, Zero Hora newspaper, Ramarim Shoes,
                Klabin Group, Sicredi, Abicalçados, Sistema FIERGS, Paquetá, Gaston, Nutrella, Laghetto Hotels, Piccadilly Shoes,
                Yara, Sescoop, Voopter, Op'n'Go, Miolo Wines, Oxiteno Chemicals, Senac, Fecomércio, SC Internacional, UCS, Correio do Povo,
                Record, Moinhos de Vento Hospital, Rio Grande do Sul Government, Santa Catarina Government, Daer, Sulgás, Detran, CEEE,
                Corsan, Zaffari Group, Angeloni Supermarkets, Renner Paints, Sayerlack, Selenium Loudspeakers, Oxford Ceramics,
                Student Travel Bureau, Colombo Stores, Fiat Dealership Network, Porto Alegre City Hall, Passo Fundo City Hall, Bento Gonçalves City Hall, Gravataí City Hall, Santa Maria City Hall, Rio Grande City Hall`,
      selectedWork: `Selected Work:`,
    },
    callToAction: {
      howCanIHelpYou: `How can I help you?`,
      getInTouch: "Get in touch:",
    },
    contactForm: {
      content: "Content",
      email: "Email",
      firstName: "First name",
      lastName: "Last name",
      subject: "Subject",
      send: "Send",
      submitSuccessful:
        "Your message has been sent successfully, thanks for reaching out!",
      errors: {
        invalidEmail: "Please insert a valid email.",
        thisFieldIsTooLong: "This field is too long.",
        thisFieldIsMandatory: "This field is mandatory.",
      },
    },
  },
};

export const pt: LocalizedCopy = {
  home: {
    meta: {
      description: `Portfolio de Marcelo Firpo: CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista. Tenho mais de 30 de experiência em comunicação, publicidade e branding, e já fui premiado em múltiplos festivais. Entre em contato agora.`,
    },
    hero: {
      name: `Marcelo Firpo`,
      subtitle: `CMO, Diretor de Criação, Consultor Criativo, Redator, Roteirista, Compositor`,
    },
    about: {
      expositionFirst: `Grandes marcas precisam traduzir contextos complexos na forma de conceitos simples, mas poderosos.

E isso é o que eu mais gosto de fazer.

Com uma trajetória extensa em criação e branding, premiação em diversos festivais e testada em segmentos dos mais variados, aprendi a transformar o que é denso e difícil em conceitos e campanhas claros e eficientes, que mobilizam as pessoas e geram resultados para as marcas.

Essa capacidade me levou além da criação. Tive uma longa experiência numa startup global de soluções de dados e IA, na qual fui o responsável pelo marketing e por estratégias de crescimento em mercados nos Estados Unidos, Europa e América Latina. 

Hoje trabalho a partir de Lisboa em projetos de estratégia criativa, branding, conteúdo e publicidade.

Sua marca precisa de mais clareza? Eu posso ajudar.`,
      someAttendedClients: `Alguns clientes atendidos:`,
      somePieces: `Alguns trabalhos:`,
      clients: `Grupo Telefónica, Petrobras, Vivo, Grupo Braskem, Edenred, Aegea, Banrisul, Grupo Gerdau, Midea-Carrier,
                Springer, GRU Airport, Husqvarna, Massey Ferguson, John Deere, Grupo RBS, Zero Hora, Ramarim, Klabin, Sicredi,
                Abicalçados, Sistema FIERGS, Paquetá, Gaston, Nutrella, Laghetto Hotéis, Piccadilly, Yara, Sescoop, Voopter,
                Op'n'Go, Vinhos Miolo, Oxiteno, Senac, Fecomércio, SC Internacional, UCS, Correio do Povo, Record,
                Hospital Moinhos de Vento, Governo do Rio Grande do Sul, Governo de Santa Catarina, Daer, Sulgás, Detran, CEEE,
                Corsan, Grupo Zaffari, Supermercados Angeloni, Tintas Renner, Sayerlack, Selenium, Cerâmicas Oxford,
                Student Travel Bureau, Lojas Colombo, Rede de Concessionárias Fiat,
                Prefeitura de Porto Alegre, Prefeitura de Passo Fundo, Prefeitura de Bento Gonçalves, Prefeitura de Gravataí, Prefeitura de Santa Maria, Prefeitura de Rio Grande`,
      selectedWork: `Trabalhos selecionados:`,
    },
    callToAction: {
      howCanIHelpYou: `Como posso te ajudar?`,
      getInTouch: "Entre em contato:",
    },
    contactForm: {
      content: "Conteúdo",
      subject: "Assunto",
      email: "E-mail",
      firstName: "Nome",
      lastName: "Sobrenome",
      send: "Enviar",
      submitSuccessful:
        "A sua mensagem foi enviada com sucesso. Obrigado por entrar em contato!",
      errors: {
        invalidEmail: "Por favor insira um e-mail válido.",
        thisFieldIsMandatory: "Este campo é mandatório.",
        thisFieldIsTooLong: "Este campo é muito longo",
      },
    },
  },
};
