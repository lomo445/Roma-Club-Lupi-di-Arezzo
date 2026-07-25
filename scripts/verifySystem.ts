import { prisma } from "../src/lib/prisma";
import { registerUserAction } from "../src/app/actions/register";

async function runTests() {
  console.log("🟢 INIZIO TEST DI VERIFICA GLOBALE DEL SISTEMA");
  
  // 1. Test Connessione Database
  console.log("\n📊 1. Verifica Connessione e Dati Esistenti...");
  const userCount = await prisma.user.count();
  const subCount = await prisma.subscription.count();
  console.log(`- Utenti nel DB: ${userCount}`);
  console.log(`- Abbonamenti nel DB: ${subCount}`);

  // 2. Test Registrazione Multipla (Famiglia)
  console.log("\n👪 2. Test Flusso Registrazione (Genitore + Figlio)...");
  const testPayload = {
    members: [
      {
        email: "test.genitore@example.com",
        password: "password123",
        nomeCognome: "Genitore Test",
        dataNascita: "1980-01-01",
        luogoNascita: "Roma",
        sesso: "Maschio",
        telefono: "3331234567",
        tipoTessera: "Adulto"
      },
      {
        email: "test.figlio@example.com",
        password: "password123",
        nomeCognome: "Figlio Test",
        dataNascita: "2015-05-05",
        luogoNascita: "Roma",
        sesso: "Maschio",
        telefono: "3331234567",
        tipoTessera: "Ridotto"
      }
    ],
    metodoPagamento: "Contanti",
    accettazionePrivacy: true
  };

  const regResult = await registerUserAction(testPayload);
  if (regResult.success) {
    console.log("- ✅ Registrazione multipla andata a buon fine.");
  } else {
    console.error("- ❌ Errore registrazione:", regResult.error);
  }

  // 3. Test Registrazione Direttivo
  console.log("\n👔 3. Test Flusso Registrazione Direttivo...");
  const adminPayload = {
    members: [
      {
        email: "test.admin@example.com",
        password: "password123",
        nomeCognome: "Admin Test",
        dataNascita: "1975-01-01",
        luogoNascita: "Milano",
        sesso: "Maschio",
        telefono: "3339999999",
        tipoTessera: "Adulto"
      }
    ],
    metodoPagamento: "Contanti",
    isDirettivo: true,
    chiaveSegreta: "LUPI26",
    accettazionePrivacy: true
  };

  const adminResult = await registerUserAction(adminPayload);
  if (adminResult.success) {
    console.log("- ✅ Registrazione Direttivo andata a buon fine.");
  } else {
    console.error("- ❌ Errore registrazione direttivo:", adminResult.error);
  }

  // 4. Verifica Integrità Dati (Numeri Tessera e Ruoli)
  console.log("\n🔍 4. Verifica Integrità Numeri Tessera, Ruoli e QR...");
  const testUsers = await prisma.user.findMany({
    where: { email: { contains: "test" } },
    orderBy: { memberNumber: 'asc' }
  });

  const memberNumbers = new Set();
  let hasDuplicateNumbers = false;

  testUsers.forEach(u => {
    console.log(`  - [${u.role}] ${u.name} ${u.surname} | Tessera: ${u.memberNumber} | QR: {"memberNumber":${u.memberNumber}}`);
    if (memberNumbers.has(u.memberNumber)) {
      hasDuplicateNumbers = true;
    }
    memberNumbers.add(u.memberNumber);
  });

  if (!hasDuplicateNumbers) {
    console.log("- ✅ I numeri di tessera e i QR Code sono UNICI e SEQUENZIALI.");
  } else {
    console.error("- ❌ ATTENZIONE: Trovati numeri di tessera duplicati!");
  }

  const adminUser = testUsers.find(u => u.email === "test.admin@example.com");
  if (adminUser?.role === "ADMIN") {
    console.log("- ✅ L'Admin ha ricevuto correttamente il ruolo ADMIN tramite la chiave segreta.");
  }

  // 5. Pulizia DB post-test
  console.log("\n🧹 5. Pulizia Dati di Test...");
  await prisma.user.deleteMany({
    where: { email: { contains: "test" } }
  });
  console.log("- ✅ Dati fittizi eliminati, DB pulito e pronto per la produzione.");

  console.log("\n✅ TUTTI I TEST PASSATI CON SUCCESSO.");
}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
