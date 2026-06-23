const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3001,
  databaseUrl: process.env.DATABASE_URL || 'memory://local'
}

export default config
