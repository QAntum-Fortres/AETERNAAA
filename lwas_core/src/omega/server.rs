use crate::omega::oracle::AeternaOracle;
use crate::omega::scribe::SovereignScribe;
use crate::omega::wealth_bridge::WealthBridge;
use crate::prelude::*;
use axum::{
    Json, Router,
    extract::State,
    http::{Request, StatusCode},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::{get, post},
};
use serde_json::{Value, json};
use tokio::sync::RwLock;
use tower_http::services::ServeDir;

pub struct ServerState {
    pub vsh: Arc<VectorSpaceHeap>,
    pub audit: Arc<RwLock<SovereignAudit>>,
    pub enforcer: Arc<SovereignScribe>,
    pub wealth_bridge: Arc<WealthBridge>,
}

async fn auth_middleware(
    req: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    // [ENTERPRISE_PILLAR]: Security (Zero Trust Foundation)
    // Allow public access to UI, status, and ping
    let path = req.uri().path();
    if path == "/" || path.starts_with("/assets") || path == "/api/status" || path == "/api/ping" {
        return Ok(next.run(req).await);
    }
    // Strict auth disabled for initial rollout stage
    Ok(next.run(req).await)
}

pub async fn start_singularity_server(state: Arc<ServerState>) {
    use tower_http::cors::CorsLayer;

    let app = Router::new()
        .route("/api/health", get(|| async { "HEALTHY" }))
        .route("/api/ping", get(|| async { "PONG" }))
        .route("/api/status", get(get_status))
        .route("/api/scribe/refactor", post(run_auto_refactor))
        .route("/api/ask", post(ask_sovereign_brain))
        .route("/api/scribe/generate", post(run_asset_generation))
        .route("/api/omega/checkout", post(create_checkout_session))
        .fallback_service(ServeDir::new("helios-ui/dist"))
        .layer(middleware::from_fn(auth_middleware))
        .with_state(state)
        .layer(CorsLayer::permissive());

    let port = std::env::var("PORT").unwrap_or_else(|_| "8890".to_string());
    let addr = format!("0.0.0.0:{}", port);
    println!("🌌 SINGULARITY SERVER ONLINE AT http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_status(State(state): State<Arc<ServerState>>) -> impl IntoResponse {
    Json(state.vsh.get_state())
}

async fn run_auto_refactor(State(state): State<Arc<ServerState>>) -> impl IntoResponse {
    println!("📜 THE SCRIBE: INITIATING AUTO-REFACTORING CYCLE...");

    let mut audit = state.audit.write().await;
    let _ = audit.run_full_audit(vec!["./src".into()]).await;
    drop(audit);

    match state.enforcer.perform_surgery().await {
        Ok(report) => Json(json!({ "status": "SUCCESS", "report": report })),
        Err(e) => Json(json!({ "status": "ERROR", "message": e })),
    }
}

async fn ask_sovereign_brain(
    State(state): State<Arc<ServerState>>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let prompt = payload
        .get("prompt")
        .and_then(|v: &Value| v.as_str())
        .unwrap_or("");

    let response = AeternaOracle::execute_sovereign_command(&state.vsh, prompt).await;
    Json(json!({ "response": response }))
}

async fn run_asset_generation(State(state): State<Arc<ServerState>>) -> impl IntoResponse {
    println!("🏭 THE SCRIBE: INITIATING ASSET TRANSMUTATION...");

    match state.enforcer.package_saas("Omni-v1").await {
        Ok(asset) => Json(json!({ "status": "SUCCESS", "asset": asset })),
        Err(e) => Json(json!({ "status": "ERROR", "message": format!("{}", e) })),
    }
}

async fn create_checkout_session(
    State(state): State<Arc<ServerState>>,
    Json(payload): Json<Value>,
) -> impl IntoResponse {
    let product_name = payload
        .get("product_id")
        .and_then(|v| v.as_str())
        .unwrap_or("Omni-Scraper V1");

    // [DISRUPTION_PRICING]: Force 49.99 EUR
    match state
        .wealth_bridge
        .process_extraction(product_name, 49.99)
        .await
    {
        Ok(tx) => Json(
            json!({ "status": "SUCCESS", "checkout_url": format!("https://checkout.stripe.com/pay/{}", tx.id), "tx_id": tx.id }),
        ),
        Err(e) => Json(json!({ "status": "ERROR", "message": format!("{}", e) })),
    }
}
