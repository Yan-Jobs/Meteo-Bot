const { Client, Intents, MessageEmbed } = require("discord.js");
const config = require("./config");
const fetch = require("node-fetch");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

client.login(config.token);

client.config = config;

client.on("ready", () => {
  console.log("Ready at " + client.user.username);
  client.guilds.cache.get("832244628329594910")?.commands.create({
    name: "weather",
    description: "Get the wether for a specific city",
    options: [
      {
        name: "city",
        description: "The city where you want to know the weather",
        type: 3,
        required: true,
      },
    ],
  });
});

client.on("interaction", async (interaction) => {
  if (interaction.commandName == "weather")
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${interaction.options[0].value}&units=metric&APPID=${client.config.api}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        let embed = new MessageEmbed()
          .setColor("#03ecfc")
          .setTitle(`Weather in ${data.name} !`)
          .addFields([
            {
              name: `<:YJ_barometer:848912877992673310>  Weather`,
              value: `${data.weather[0].main}`,
              inline: true,
            },
            {
              name: "<:YJ_thermometer:848910964317093918>  Temperature",
              value: `${data.main.temp}° C, feels like ${data.main.feels_like}° C`,
              inline: true,
            },
            {
              name: `<:YJ_temperature:848922904107810918>  Temperature *(max, min)*`,
              value: `Max: ${data.main.temp_max}, min: ${data.main.temp_min}`,
            },
            {
              name: `<:YJ_pressuregauge:848918168952897537>  Pressure`,
              value: `${data.main.pressure} hPa`,
              inline: true,
            },
            {
              name: `<:YJ_hygrometer:848919231847727155> Humidity`,
              value: `${data.main.humidity} %`,
              inline: true,
            },
            {
              name: `<:YJ_wind:848923807556304966>  Wind`,
              value: `${data.wind.speed} m/s, direction: ${data.wind.deg} °`,
              inline: true,
            },
            {
              name: `<:YJ_eyes:848926692097392661>  Visibility`,
              value: `${data.visibility} m`,
              inline: true,
            },
          ]);
        await interaction.reply(embed);
      })
      .catch(async (err) => {
        await interaction.reply(
          "<:YJ_error:845314543118844014>  An error occured. Please verify the name of the city."
        );
      });
});
