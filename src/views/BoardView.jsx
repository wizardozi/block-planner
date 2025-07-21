import Board from '../components/Board';

export default function BoardView({ projectTasks }) {
  return (
    <div>
      <Board tasks={projectTasks} />
    </div>
  );
}
