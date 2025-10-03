import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d07800a2/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Authentication routes
app.post("/make-server-d07800a2/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: "Email, password e nome são obrigatórios" }, 400);
    }

    // Create user with admin API (auto-confirms email)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      role: 'admin', // Default role
      created_at: new Date().toISOString()
    });

    return c.json({ 
      message: "Usuário criado com sucesso",
      user: {
        id: data.user.id,
        email: data.user.email,
        name
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Erro interno do servidor" }, 500);
  }
});

// Protected routes middleware
async function requireAuth(c, next) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Token de acesso não fornecido" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      return c.json({ error: "Token inválido ou usuário não encontrado" }, 401);
    }

    // Store user in context
    c.set('user', user);
    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Erro de autenticação" }, 401);
  }
}

// Add timeout middleware for all routes
async function withTimeout(c, next) {
  const timeoutId = setTimeout(() => {
    console.error(`Request timeout for ${c.req.method} ${c.req.url}`);
  }, 25000); // 25 seconds timeout

  try {
    await next();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Apply timeout middleware
app.use('*', withTimeout);

// Data management routes

// Slides/Carousel management
app.get("/make-server-d07800a2/slides", async (c) => {
  try {
    const slides = await kv.get('carousel:slides') || [];
    return c.json({ slides });
  } catch (error) {
    console.error("Get slides error:", error);
    return c.json({ error: "Erro ao buscar slides" }, 500);
  }
});

app.post("/make-server-d07800a2/slides", requireAuth, async (c) => {
  try {
    const { slides } = await c.req.json();
    await kv.set('carousel:slides', slides);
    return c.json({ message: "Slides atualizados com sucesso" });
  } catch (error) {
    console.error("Update slides error:", error);
    return c.json({ error: "Erro ao atualizar slides" }, 500);
  }
});

// Pages management
app.get("/make-server-d07800a2/pages", async (c) => {
  try {
    const pages = await kv.getByPrefix('page:');
    return c.json({ pages });
  } catch (error) {
    console.error("Get pages error:", error);
    return c.json({ error: "Erro ao buscar páginas" }, 500);
  }
});

app.post("/make-server-d07800a2/pages", requireAuth, async (c) => {
  try {
    const page = await c.req.json();
    const pageId = page.id || `page_${Date.now()}`;
    await kv.set(`page:${pageId}`, { ...page, id: pageId, updated_at: new Date().toISOString() });
    return c.json({ message: "Página salva com sucesso", id: pageId });
  } catch (error) {
    console.error("Save page error:", error);
    return c.json({ error: "Erro ao salvar página" }, 500);
  }
});

app.get("/make-server-d07800a2/pages/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const page = await kv.get(`page:${id}`);
    if (!page) {
      return c.json({ error: "Página não encontrada" }, 404);
    }
    return c.json({ page });
  } catch (error) {
    console.error("Get page error:", error);
    return c.json({ error: "Erro ao buscar página" }, 500);
  }
});

app.delete("/make-server-d07800a2/pages/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`page:${id}`);
    return c.json({ message: "Página excluída com sucesso" });
  } catch (error) {
    console.error("Delete page error:", error);
    return c.json({ error: "Erro ao excluir página" }, 500);
  }
});

// Events/Calendar management
app.get("/make-server-d07800a2/events", async (c) => {
  try {
    const events = await kv.getByPrefix('event:');
    return c.json({ events });
  } catch (error) {
    console.error("Get events error:", error);
    return c.json({ error: "Erro ao buscar eventos" }, 500);
  }
});

app.post("/make-server-d07800a2/events", requireAuth, async (c) => {
  try {
    const event = await c.req.json();
    const eventId = event.id || `event_${Date.now()}`;
    await kv.set(`event:${eventId}`, { ...event, id: eventId, updated_at: new Date().toISOString() });
    return c.json({ message: "Evento salvo com sucesso", id: eventId });
  } catch (error) {
    console.error("Save event error:", error);
    return c.json({ error: "Erro ao salvar evento" }, 500);
  }
});

app.delete("/make-server-d07800a2/events/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`event:${id}`);
    return c.json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    console.error("Delete event error:", error);
    return c.json({ error: "Erro ao excluir evento" }, 500);
  }
});

// Services management
app.get("/make-server-d07800a2/services", async (c) => {
  try {
    const services = await kv.getByPrefix('service:');
    return c.json({ services });
  } catch (error) {
    console.error("Get services error:", error);
    return c.json({ error: "Erro ao buscar serviços" }, 500);
  }
});

app.post("/make-server-d07800a2/services", requireAuth, async (c) => {
  try {
    const service = await c.req.json();
    const serviceId = service.id || `service_${Date.now()}`;
    await kv.set(`service:${serviceId}`, { ...service, id: serviceId, updated_at: new Date().toISOString() });
    return c.json({ message: "Serviço salvo com sucesso", id: serviceId });
  } catch (error) {
    console.error("Save service error:", error);
    return c.json({ error: "Erro ao salvar serviço" }, 500);
  }
});

app.delete("/make-server-d07800a2/services/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`service:${id}`);
    return c.json({ message: "Serviço excluído com sucesso" });
  } catch (error) {
    console.error("Delete service error:", error);
    return c.json({ error: "Erro ao excluir serviço" }, 500);
  }
});

// Gallery management
app.get("/make-server-d07800a2/gallery", async (c) => {
  try {
    const galleries = await kv.getByPrefix('gallery:');
    return c.json({ galleries });
  } catch (error) {
    console.error("Get galleries error:", error);
    return c.json({ error: "Erro ao buscar galerias" }, 500);
  }
});

app.post("/make-server-d07800a2/gallery", requireAuth, async (c) => {
  try {
    const gallery = await c.req.json();
    const galleryId = gallery.id || `gallery_${Date.now()}`;
    await kv.set(`gallery:${galleryId}`, { ...gallery, id: galleryId, updated_at: new Date().toISOString() });
    return c.json({ message: "Galeria salva com sucesso", id: galleryId });
  } catch (error) {
    console.error("Save gallery error:", error);
    return c.json({ error: "Erro ao salvar galeria" }, 500);
  }
});

app.delete("/make-server-d07800a2/gallery/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`gallery:${id}`);
    return c.json({ message: "Galeria excluída com sucesso" });
  } catch (error) {
    console.error("Delete gallery error:", error);
    return c.json({ error: "Erro ao excluir galeria" }, 500);
  }
});

// Forms management
app.get("/make-server-d07800a2/forms", async (c) => {
  try {
    const forms = await kv.getByPrefix('form:');
    return c.json({ forms });
  } catch (error) {
    console.error("Get forms error:", error);
    return c.json({ error: "Erro ao buscar formulários" }, 500);
  }
});

app.post("/make-server-d07800a2/forms", requireAuth, async (c) => {
  try {
    const form = await c.req.json();
    const formId = form.id || `form_${Date.now()}`;
    await kv.set(`form:${formId}`, { ...form, id: formId, updated_at: new Date().toISOString() });
    return c.json({ message: "Formulário salvo com sucesso", id: formId });
  } catch (error) {
    console.error("Save form error:", error);
    return c.json({ error: "Erro ao salvar formulário" }, 500);
  }
});

app.get("/make-server-d07800a2/forms/:slug", async (c) => {
  try {
    const slug = c.req.param('slug');
    const forms = await kv.getByPrefix('form:');
    const form = forms.find(f => f.slug === slug);
    if (!form) {
      return c.json({ error: "Formulário não encontrado" }, 404);
    }
    return c.json({ form });
  } catch (error) {
    console.error("Get form by slug error:", error);
    return c.json({ error: "Erro ao buscar formulário" }, 500);
  }
});

// Form submissions
app.post("/make-server-d07800a2/forms/:slug/submit", async (c) => {
  try {
    const slug = c.req.param('slug');
    const submission = await c.req.json();
    
    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(`submission:${submissionId}`, {
      id: submissionId,
      formSlug: slug,
      data: submission,
      submittedAt: new Date().toISOString()
    });
    
    return c.json({ message: "Formulário enviado com sucesso", id: submissionId });
  } catch (error) {
    console.error("Form submission error:", error);
    return c.json({ error: "Erro ao enviar formulário" }, 500);
  }
});

app.get("/make-server-d07800a2/submissions", requireAuth, async (c) => {
  try {
    const submissions = await kv.getByPrefix('submission:');
    return c.json({ submissions });
  } catch (error) {
    console.error("Get submissions error:", error);
    return c.json({ error: "Erro ao buscar submissões" }, 500);
  }
});

// Secretarias management
app.get("/make-server-d07800a2/secretarias", async (c) => {
  try {
    const secretarias = await kv.getByPrefix('secretaria:');
    return c.json({ secretarias });
  } catch (error) {
    console.error("Get secretarias error:", error);
    return c.json({ error: "Erro ao buscar secretarias" }, 500);
  }
});

app.post("/make-server-d07800a2/secretarias", requireAuth, async (c) => {
  try {
    const secretaria = await c.req.json();
    const secretariaId = secretaria.id || `secretaria_${Date.now()}`;
    await kv.set(`secretaria:${secretariaId}`, { ...secretaria, id: secretariaId, updated_at: new Date().toISOString() });
    return c.json({ message: "Secretaria salva com sucesso", id: secretariaId });
  } catch (error) {
    console.error("Save secretaria error:", error);
    return c.json({ error: "Erro ao salvar secretaria" }, 500);
  }
});

app.delete("/make-server-d07800a2/secretarias/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`secretaria:${id}`);
    return c.json({ message: "Secretaria excluída com sucesso" });
  } catch (error) {
    console.error("Delete secretaria error:", error);
    return c.json({ error: "Erro ao excluir secretaria" }, 500);
  }
});

// Settings management
app.get("/make-server-d07800a2/settings", async (c) => {
  try {
    const settings = await kv.get('site:settings') || {};
    return c.json({ settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return c.json({ error: "Erro ao buscar configurações" }, 500);
  }
});

app.post("/make-server-d07800a2/settings", requireAuth, async (c) => {
  try {
    const settings = await c.req.json();
    await kv.set('site:settings', { ...settings, updated_at: new Date().toISOString() });
    return c.json({ message: "Configurações salvas com sucesso" });
  } catch (error) {
    console.error("Save settings error:", error);
    return c.json({ error: "Erro ao salvar configurações" }, 500);
  }
});

// User management
app.get("/make-server-d07800a2/users", requireAuth, async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    // Remove sensitive data
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at
    }));
    return c.json({ users: safeUsers });
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ error: "Erro ao buscar usuários" }, 500);
  }
});

Deno.serve(app.fetch);