export default ({ req, _ }) => {
    return {
        hostname: req.hostname,
        protocol: req.protocol,
        user_agent: req.headers['user-agent'],
        token: req.headers['token']
    }
}