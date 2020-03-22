"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const github_api_1 = __importDefault(require("github-api"));
const moment_1 = __importDefault(require("moment"));
const filesize_1 = __importDefault(require("filesize"));
const open_graph_scraper_1 = __importDefault(require("open-graph-scraper"));
const config_1 = require("../config");
const error_1 = require("../utilities/error");
function respond(command, message, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const parse = command.substring(7).split('/');
        if (parse.length > 2) {
            message.channel.send(':beetle: **Invalid input provided. Run for example** `;github vasanthdeveloper/samaya`');
            return false;
        }
        const git = new github_api_1.default();
        const response = new discord_js_1.default.MessageEmbed()
            .setColor(config.get('embedColor'))
            .setAuthor(message.member.displayName, message.author.displayAvatarURL({
            dynamic: true,
            format: 'webp',
            size: 256
        }))
            .setFooter(`mantu v${config_1.appInfo.version}`);
        if (parse.length == 1) {
            const user = yield error_1.errorHandler((yield git.getUser(parse[0])).getProfile());
            if (user.e) {
                message.channel.send(`:beetle: **A user with username ${parse[0]} does not exist.**`);
                return false;
            }
            response.setTitle(`github.com/${user.data.data.login}`)
                .setURL(user.data.data.html_url)
                .addField('Following', user.data.data.following, true)
                .addField('Followers', user.data.data.followers, true)
                .addField('Joined on', moment_1.default(user.data.data.created_at).format('l'), true)
                .setFooter(`Updated on ${moment_1.default(user.data.data.updated_at).format('LL')}`);
            if (user.data.data.location != '')
                response.addField('Location', user.data.data.location, true);
            if (user.data.data.blog != '')
                response.addField('Web', user.data.data.blog, true);
            if (user.data.data.bio != null && user.data.data.bio != '')
                response.setDescription(user.data.data.bio);
            if (user.data.data.avatar_url != '')
                response.setThumbnail(user.data.data.avatar_url);
            message.channel.send('', {
                embed: response
            });
        }
        else {
            const repo = yield error_1.errorHandler((yield git.getRepo(parse[0], parse[1])).getDetails());
            const ogData = yield error_1.errorHandler(open_graph_scraper_1.default({ url: repo.data.data.html_url, encoding: 'UTF-8' }));
            const repoImage = (ogData.data.success == true) ? ogData.data.data.ogImage.url : null;
            if (repo.e) {
                message.channel.send(`:beetle: **The repository ${parse.join('/')} could not be found.**`);
                return false;
            }
            console.log(repo.data.data);
            response.setTitle(repo.data.data.full_name)
                .setURL(repo.data.data.html_url);
            if (repoImage.startsWith('https://avatars') == false)
                response.setImage(repoImage);
            if (repo.data.data.description)
                response.setDescription(repo.data.data.description);
            if (repo.data.data.language)
                response.addField('Language', repo.data.data.language, true);
            response.addField('Created On', moment_1.default(repo.data.data.created_at).format('l'), true)
                .addField('Branch', repo.data.data.default_branch, true)
                .addField('Author', `[${repo.data.data.owner.login}](${repo.data.data.owner.html_url})`, true)
                .addField('Size', filesize_1.default((repo.data.data.size * 1000)), true);
            if (repo.data.data.license)
                response.addField('License', repo.data.data.license.spdx_id == 'NOASSERTION' ? 'Unknown' : repo.data.data.license.spdx_id, true);
            response.addField('Links', `${(repo.data.data.homepage) ? `[Homepage](${repo.data.data.homepage}) | ` : ''}[Issues](${repo.data.data.html_url}/issues) | [Pull Requests](${repo.data.data.html_url}/pulls)${(repo.data.data.has_wiki) ? ` | [Wiki](${repo.data.data.html_url}/wiki)` : ''}`)
                .setFooter(`Pushed on ${moment_1.default(repo.data.data.pushed_at).format('LL')}`);
            message.channel.send('', {
                embed: response
            });
        }
        return true;
    });
}
exports.default = respond;
