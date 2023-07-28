import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

const SideBar = styled.div`
  width: 260px;
  height: 100%;
  background: #1e8976;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
`;

const Content = styled.div`
  padding: 30px 30px 30px calc(260px + 30px);
`;

const Title = styled.h1`
  padding: 0;
  margin: 0 0 15px 0;
  font-size: 15px;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
`;

const Line = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;

  div {
    position: relative;
  }

  input {
    width: 190px;
    background: #eeeeee;
    border: 0;
    height: 45px;
    border-radius: 5px;
    text-align: center;
    padding: 0 10px;

    &[type='date'] {
      width: 140px;
    }
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 190px;
    background: #eeeeee;
    border: 0;
    height: 45px;
    pointer-events: none;
    border-radius: 5px;
    text-align: center;
    padding: 0 10px;
    position: absolute;
    top: 0;

    &.active {
      width: auto;
      height: auto;
      top: -20px;
      background: none;
    }
  }

  .horarios {
    display: flex;
    gap: 20px;
  }

  .horario:hover label:not(.active) {
    opacity: 0;
  }

  .adicionaHorario {
    cursor: pointer;
  }
`;

const AdicionaDia = styled.div`
  cursor: pointer;
  display: flex;
  margin-top: 20px;
  width: 60%;
  font-size: 14px;
  align-items: center;
  background: #eeeeee;
  height: 45px;
  border-radius: 5px;
  padding: 0 10px;
`;

const Days = styled.div`
  position: relative;
  padding: 30px;
  min-height: 500px;
  background: #ffffff;
  border-radius: 5px;
  overflow: auto;
  padding-bottom: 105px;
`;

const ContagemFinal = styled.div`
  height: 80px;
  display: flex;
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
  justify-content: space-around;
  background: #eeeeee;
  box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  align-items: center;

  input {
    width: 190px;
    background: #fff;
    border: 0;
    height: 45px;
    border-radius: 5px;
    text-align: center;
    padding: 0 10px;
  }
`;

const today = new Date().toISOString().slice(0, 10);
const padraoHora = {
  entrada: '00:00',
  saida: '00:00',
};

const padraoLinha = {
  dia: today,
  horarios: [padraoHora, padraoHora],
};

const padraoLinhas = [padraoLinha];

const App = () => {
  const [linhas, setLinhas] = useState(padraoLinhas);
  const [valorHora, setValorHora] = useState('');

  const clicouParaAdicionarLinha = () => {
    const novaLinhas = [...linhas, padraoLinha];

    setLinhas(novaLinhas);
  };

  const clicouParaAdicionarHora = (index) => {
    const novaLinhas = linhas.map((linha, indexLinha) => {
      if (indexLinha === index) {
        return {
          ...linha,
          horarios: [...linha.horarios, padraoHora],
        };
      }

      return linha;
    });

    setLinhas(novaLinhas);
  };

  const alterarDia = (value, index) => {
    const novaLinhas = linhas.map((linha, indexLinha) => {
      if (indexLinha === index) {
        return {
          ...linha,
          dia: value,
        };
      }
      return linha;
    });

    setLinhas(novaLinhas);
  };

  const alterarHora = (valor, indexL, indexH, type) => {
    const novaLinhas = linhas.map((linha, indexLinha) => {
      if (indexL === indexLinha) {
        const horarios = linha.horarios.map((horario, indexHorario) => {
          if (indexHorario === indexH) {
            return {
              ...horario,
              [type]: valor,
            };
          }
          return horario;
        });
        return {
          ...linha,
          horarios: horarios,
        };
      }

      return linha;
    });

    setLinhas(novaLinhas);
  };

  const RetornaQuantidadeHoras = (horarioEntrada, horarioSaida) => {
    const entradaSeparada = horarioEntrada.split(':');
    const saidaSeparada = horarioSaida.split(':');

    const diferencaMinutos = saidaSeparada[1] - entradaSeparada[1];
    const diferencaHora = saidaSeparada[0] - entradaSeparada[0];

    return (diferencaHora * 60 + diferencaMinutos) / 60;
  };

  const quantidadeHoras = useMemo(() => {
    let qtdHoras = 0;

    linhas.forEach((linha) => {
      linha.horarios.forEach((horario) => {
        if (horario.entrada !== '00:00' && horario.saida !== '00:00') {
          const horas = RetornaQuantidadeHoras(horario.entrada, horario.saida);

          qtdHoras = qtdHoras + horas;
        }
      });
    });

    return qtdHoras.toFixed(2);
  }, [linhas]);

  return (
    <>
      <SideBar>
        <img src="/images/logo.png" alt="logo" />
      </SideBar>
      <Content>
        <Title>Minhas Horas</Title>
        <Days>
          {linhas.map((linha, indexLinha) => {
            return (
              <Line key={indexLinha}>
                <div>
                  <input
                    type="date"
                    value={linha.dia}
                    onChange={(evento) =>
                      alterarDia(evento.target.value, indexLinha)
                    }
                  />
                </div>
                <div>:</div>

                {linha.horarios.map((hora, indexHora) => {
                  return (
                    <React.Fragment key={indexHora + 'horario'}>
                      {indexHora !== 0 ? <div>|</div> : false}
                      <div className="horarios">
                        <div className="horario">
                          <label
                            htmlFor={indexHora + 'entrada'}
                            className={hora.entrada !== '00:00' ? 'active' : ''}
                          >
                            Entrada
                          </label>
                          <input
                            type="time"
                            value={hora.entrada}
                            id={indexHora + 'entrada'}
                            name={indexHora + 'entrada'}
                            onChange={(evento) =>
                              alterarHora(
                                evento.target.value,
                                indexLinha,
                                indexHora,
                                'entrada',
                              )
                            }
                          />
                        </div>
                        <div className="horario">
                          <label
                            htmlFor={indexHora + 'saida'}
                            className={hora.saida !== '00:00' ? 'active' : ''}
                          >
                            Saida
                          </label>
                          <input
                            type="time"
                            value={hora.saida}
                            id={indexHora + 'saida'}
                            name={indexHora + 'saida'}
                            onChange={(evento) =>
                              alterarHora(
                                evento.target.value,
                                indexLinha,
                                indexHora,
                                'saida',
                              )
                            }
                          />
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}

                <div
                  className="adicionaHorario"
                  onClick={() => clicouParaAdicionarHora(indexLinha)}
                >
                  +
                </div>
              </Line>
            );
          })}

          <AdicionaDia onClick={() => clicouParaAdicionarLinha()}>
            + Adiciona Data
          </AdicionaDia>
          <ContagemFinal>
            <div>Dias trabalhados: {linhas.length}</div>
            <div>Quantidade de horas: {quantidadeHoras}h</div>
            <input
              placeholder="valor da hora"
              value={valorHora}
              onChange={(evento) => setValorHora(evento.target.value)}
            />
            <div>
              Valores a receber: R${' '}
              {(quantidadeHoras * Number(valorHora)).toFixed(2)}
            </div>
          </ContagemFinal>
        </Days>
      </Content>
    </>
  );
};

export default App;
