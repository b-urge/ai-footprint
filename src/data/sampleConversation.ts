export const SAMPLE_CONVERSATION = `User: Can you explain quantum computing in plain terms? I'm curious how it's different from the computers we use today.

Assistant: Classical computers store information as bits — each bit is either 0 or 1. Every calculation, from opening a browser tab to training a small model, is ultimately a long sequence of operations on those bits.

Quantum computers use qubits. Thanks to superposition, a qubit can represent a blend of 0 and 1 at the same time, not just one or the other. Entanglement links qubits so that measuring one can instantly constrain what you know about another, even when they're far apart.

That doesn't make quantum machines "infinitely fast" for everything. They're built for specific problem classes: simulating molecules and materials, certain optimization tasks, and some cryptographic analyses. For everyday software — email, spreadsheets, most web apps — classical hardware remains the right tool.

The engineering is brutal. Qubits are fragile. Noise from heat, vibration, and electromagnetic interference causes errors. Labs run them at cryogenic temperatures and surround them with shielding. Error correction stacks many physical qubits into one logical qubit, which is why today's devices might have hundreds of physical qubits but only a handful of reliable logical ones.

Major players include IBM, Google, IonQ, and research labs worldwide. Progress is real but incremental: more qubits, better coherence times, improved error rates. A useful general-purpose quantum computer — one that clearly beats classical machines on commercially valuable workloads at scale — is still years away, though niche advantages are already appearing in research settings.

User: So when people say quantum computers will "break encryption," is that hype or real?

Assistant: It's real in principle, but the timeline is debated. RSA and similar schemes rely on the difficulty of factoring large numbers. Shor's algorithm, run on a sufficiently large fault-tolerant quantum computer, could factor those numbers efficiently. That would undermine much of today's public-key infrastructure.

We're not there yet. Breaking 2048-bit RSA is estimated to need millions of high-quality logical qubits — far beyond current hardware. The response is post-quantum cryptography: new algorithms designed to resist both classical and quantum attacks. NIST has already standardized several candidates, and organizations are beginning migration planning.

So the risk isn't "tomorrow." It's "plan now." Harvest-now-decrypt-later attacks mean adversaries might store encrypted traffic today to decrypt later when hardware catches up. That's why governments and enterprises are taking the threat seriously even before a cryptographically relevant machine exists.

For your everyday AI chat, none of this changes the physics of data centers today — but it's a useful reminder that breakthrough technologies carry second-order consequences we have to engineer around early, not after the fact.`;
